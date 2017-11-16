<?php

class AssocUsersAcy
{
	/**
	 * @param array $associadosIds = Ids dos associados inseridos
	 *
	 * @return object|mixed = Informações dos novos associados inseridos
	 */
	public static function getAssociadosInfoByIds(array $associadosIds)
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);
		$query->select('id, state, user_id, nome, email, cpf, amatra, state')->from('#__associados')
			->where('id IN (' . implode(',', $associadosIds) . ")");

		return $db->setQuery($query)->loadObjectList();
	}


	/**
	 * Criando usuários do Jooma para todos os novos associados inseridos
	 *
	 * @param $associados
	 *
	 * @throws Exception
	 */
	public static function createUsers($associados)
	{
		jimport('joomla.user.helper');
		$app = JFactory::getApplication();

		foreach ($associados as $key => $associado)
		{

			if (empty($associado->user_id) && !empty($associado->nome) && !empty($associado->cpf) && !empty($associado->email))
			{

				$cpfSanitized = preg_replace('/\D/', '', $associado->cpf);
				$groups       = array(10); // 10 = id do usergroup "Associados"

				if (!empty($associado->amatra))
				{
					// Subtraindo para não precisar fazer deparams do id da Amatra com o id do Usergroup referente à Amatra
					$userGroupAmatra = (intval($associado->amatra) - 34);
					array_push($groups, $userGroupAmatra);
				}

				// Evitar que usuários duplicados sejam criados: Caso já exista, irá fazer os vínculos
				$userId = JUserHelper::getUserId($cpfSanitized);

				if (!empty($userId))
				{
					$user = JFactory::getUser($userId);

					if (!empty($userGroupAmatra) && !in_array(strval($userGroupAmatra), $user->groups))
					{
						JUserHelper::setUserGroups($userId, array(10, $userGroupAmatra));
					}
					self::updateAssociadoUserId($associado->id, $userId);
				}
				else
				{
					//Gerar senha padrão anamatra + 3 digitos do CPF
					$pass = 'anamatra' . mb_substr($associado->cpf, 0, 3);

					$data = array(
						"name"         => $associado->nome,
						"username"     => $cpfSanitized,
						"requireReset" => 1,
						"email"        => $associado->email,
						"block"        => 0,
						"groups"       => $groups,
						"password"     => $pass,
						"password2"    => $pass
					);

					$user = new JUser;

					// Salvando no banco de dados
					if (!$user->bind($data) || !$user->save())
					{
						// Em caso de erro ao salvar o usuário do associado, tenta reivincular o id de usuário ao user_id do associado.
						if (!self::treatUserCreationError($user->getError(), $associado->id, $associado->email,
								$cpfSanitized) && $app->isAdmin()
						)
						{
							// Caso não consiga reivincular e estiver no backend, lança a mensagem de erro - Sem bloquear a criação dos outros.
							$app->enqueueMessage('<b>' . $user->getError() . '  ==> Nome:</b> ' . $associado->nome .
								'<b> - CPF:</b> ' . $associado->cpf, 'error');
						}
					}
					else
					{
						self::updateAssociadoUserId($associado->id, $user->id);
						//Se o helper for acessado por um plugin de front-end será necessário forçar o envio do e-mail
						if ($app->isSite())
						{
							self::mailToUser($user);
						}
					}
				}

				self::setAcyListsToSubscriber($associado->email, array(1, ($associado->amatra - 44)));
			}
		}

		return true;
	}

	/**
	 * Enviar email para usuário criado
	 *
	 * @param JUser $user
	 */
	public static function mailToUser($user)
	{
		$app = JFactory::getApplication();

		JFactory::getLanguage()->load('plg_user_joomla', JPATH_ADMINISTRATOR);

		$emailSubject = JText::sprintf('PLG_USER_JOOMLA_NEW_USER_EMAIL_SUBJECT',
			$user->name, $config = $app->get('sitename')
		);

		$emailBody = JText::sprintf('PLG_USER_JOOMLA_NEW_USER_EMAIL_BODY', $user->name, $app->get('sitename'),
			JUri::root(), $user->username, $user->password_clear
		);

		$mail = JFactory::getMailer()
			->setSender(
				array(
					$app->get('mailfrom'),
					$app->get('fromname')
				)
			)
			->addRecipient($user->email)->setSubject($emailSubject)->setBody($emailBody);

		if (!$mail->Send())
		{
			$app->enqueueMessage(JText::_('JERROR_SENDING_EMAIL'), 'warning');
		}
	}

	/**
	 * Cadastrar listas do Acymailing para um usuário do Joomla
	 *
	 * @param integer|string $subId  = email ou user_id de um usuário do Joomla
	 * @param array          $listas = array de listas que um
	 */
	public static function setAcyListsToSubscriber($subId, $listas)
	{
		include_once(JPATH_ADMINISTRATOR . '/components/com_acymailing/helpers/helper.php');

		$userClass = acymailing_get('class.subscriber');

		$inscricoes = array();
		foreach ($listas as $lista)
		{
			$inscricoes[$lista] = array('status' => 1);
		}

		$userClass->saveSubscription($userClass->subid($subId), $inscricoes);
	}

	/**
	 * Atualizar o user_id do Associado para o usuário recém criado
	 *
	 * @param $associadoId = id do Associado
	 * @param $userId      = id o usuário
	 */
	public static function updateAssociadoUserId($associadoId, $userId)
	{
		$db = JFactory::getDbo();

		$query = $db->getQuery(true);

		$query->update($db->quoteName('#__associados'))
			->set('user_id = ' . $userId)->where('id = ' . $associadoId);

		$db->setQuery($query)->execute();
	}

	/**
	 * Verificar e atualizar os usuários/acy_subscription dos associados que tiveram email e/ou estado alterados
	 *
	 * @param array $associados
	 */
	public static function verifyUsersToUpdate($associados)
	{
		foreach ($associados as $associado)
		{
			$user = JFactory::getUser($associado->user_id);

			if ($associado->email != $user->email || $associado->state == $user->block)
			{
				$data = array(
					"name"  => $associado->nome,
					"email" => $associado->email,
					"block" => ($associado->state == '1' ? 0 : 1)
				);

				$user->bind($data);
				$user->save();
				self::updateAcySubscriber($associado->user_id, $associado->state, $associado->email);
			}
		}
	}

	/**
	 * Atualizar o dados do usuário no Acymailing (email e/ou se está bloqueado ou não)
	 *
	 * @param object|mixed $associado = Associado que foi atualizado
	 */
	public static function updateAcySubscriber($userId, $state, $email)
	{
		if (!empty($userId) && !empty($email))
		{
			$db    = JFactory::getDbo();
			$query = $db->getQuery(true);

			$query->update($db->quoteName('#__acymailing_subscriber'))
				->set('enabled = ' . $state . ', email = ' . $db->quote($email))
				->where('userid = ' . $userId);

			$db->setQuery($query)->execute();
		}
	}

	/**
	 * Reivincular o id do usuário ao user_id do Associado
	 * (Tratamento de erros caso já exista usuário com este e-mail ou username)
	 *
	 *
	 * @param string  $error
	 * @param integer $idAssociado
	 * @param string  $emailAssoc
	 * @param integer $userName = CPF do Associado
	 *
	 * @return bool = TRUE caso reivincule, FALSE do contrário
	 *
	 */
	private static function treatUserCreationError($error, $idAssociado, $emailAssoc, $userName)
	{
		if ($error == JText::_('JLIB_DATABASE_ERROR_EMAIL_INUSE') || $error == JText::_('JLIB_DATABASE_ERROR_USERNAME_INUSE'))
		{
			$db = JFactory::getDbo();

			$query = $db->getQuery(true);
			$query->select('id')->from($db->quoteName('#__users'))
				->where('username = ' . $db->quote($userName) . ' OR email = ' . $db->quote($emailAssoc))
				->setLimit(1);

			$userId = $db->setQuery($query)->loadResult();

			if (!empty($userId))
			{
				self::updateAssociadoUserId($idAssociado, $userId);

				return true;
			}
		}

		return false;
	}
}
