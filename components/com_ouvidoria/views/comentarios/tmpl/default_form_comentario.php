<?php if (!$this->isSolicitacaoDisabled): ?>
	<div class="col-sm-4">
		<div class="comentario-edit front-end-edit affix" data-spy="affix" data-offset-top="600" data-offset-bottom="200">
			<a class="btn btn-primary btn-lg visible-xs collapsed" role="button" data-toggle="collapse" href="#toggle-comment" aria-expanded="false" aria-controls="toggle-comment">
				<i class="fa fa-cog"></i> <span class="sr-only"><?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_ACTIONS'); ?></span>
			</a>
			<div class="collapse" id="toggle-comment">
				<form id="comentario-form" data-form="comentarios" class="form-validate" method="post" enctype="multipart/form-data"
				      action="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=comentario.save'); ?>">
					<legend>
						<small>
							<i class="fa <?php echo $this->isUserOuvidoriaOrSuperUser ? 'fa-cog' : 'fa-comment' ?>"></i>
							<span id="legend-form">
							<?php echo JText::_($this->isUserOuvidoriaOrSuperUser ? 'COM_OUVIDORIA_COMENTARIOS_ACTIONS' : 'COM_OUVIDORIA_COMENTARIOS_COMENTE_NESTE'); ?>
						</span>
						</small>
					</legend>
					<div class="form-group">
						<div class="control-group <?php echo count($this->interacoes) == 1 && !$this->isUserOuvidoriaOrSuperUser ? 'hidden' : ''; ?>">
							<label for="comentario" class="sr-only">Selecione a ação</label>
							<div class="controls">
								<select name="jform[acao]" id="jform_acao">
									<option value="">- Selecione uma ação -</option>
									<?php foreach ($this->interacoes as $id => $interacao): ?>
										<option value="<?php echo $id; ?>" <?php echo count($this->interacoes) == 1 ? 'selected="true"' : '' ?>>
											<?php echo $interacao; ?>
										</option>
									<?php endforeach; ?>
								</select>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="control-group hidden">
							<label id="jfom_texto" for="jform_texto">Mensagem*</label>

							<div class="controls">
								<textarea name="jform[texto]" id="jform_texto" class="form-control" placeholder="Mensagem"></textarea>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="control-group hidden">
							<label id="jform_id_user_consultado-lbl" for="jform_id_user_consultado">Quem deseja consultar?*</label>
							<div class="controls">
								<select id="jform_id_user_consultado" name="jform[id_user_consultado]">
									<option value="">- Selecione -</option>
									<?php foreach ($this->consultaveis as $userId => $userName): ?>
										<option value="<?php echo $userId; ?>"><?php echo $userName; ?></option>
									<?php endforeach; ?>
								</select>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="control-group hidden">
							<label id="jform_diretoria_transferencia-lbl" for="jform_diretoria_transferencia">Transferir para*</label>
							<div class="controls">
								<select id="jform_diretoria_transferencia" name="jform[diretoria_transferencia]">
									<option value="">- Selecione -</option>
									<?php foreach ($this->diretorias as $idDiretoria => $diretoriaNome): ?>
										<?php if ($diretoriaNome != $this->solicitacao->id_diretoria_responsavel): ?>
											<option value="<?php echo $idDiretoria; ?>"><?php echo $diretoriaNome; ?></option>
										<?php endif ?>
									<?php endforeach; ?>
								</select>
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="control-group hidden">
							<label id="jform_anexo-lbl" for="jform_anexo">Anexo</label>
							<div class="controls">
								<input id="jform_anexo" name="jform[anexo][]" multiple="" type="file">
							</div>
						</div>
					</div>
					<div class="form-group">
						<div class="control-group hidden">
							<div class="controls text-right">
								<button id="submit-button" type="submit" class="validate btn btn-primary">
									<?php echo JText::_('COM_OUVIDORIA_COMENTARIOS_OK'); ?>
								</button>
							</div>
						</div>
					</div>

					<?php if (!empty($this->comentarioToAnswer) && !empty(!empty($this->comentarioToAnswer->id))): ?>
						<input type="hidden" name="jform[comentarioToAnswer][created_by]" value="<?php echo $this->comentarioToAnswer->created_by; ?>"/>
						<input type="hidden" name="jform[comentarioToAnswer][id]" value="<?php echo $this->comentarioToAnswer->id; ?>"/>
					<?php endif; ?>

					<?php if (!$this->isUserOuvidoriaOrSuperUser): ?>
						<input type="hidden" name="jform[created_by_solicitante]" value="<?php echo $this->solicitante->id; ?>"/>
					<?php endif; ?>

					<input type="hidden" name="jform[state]" value="1"/>
					<input type="hidden" name="jform[id_solicitacao]" value="<?php echo $this->solicitacao->id; ?>"/>
					<input type="hidden" name="option" value="com_ouvidoria"/>
					<input type="hidden" name="task" value="comentarioform.save"/>
					<?php echo JHtml::_('form.token'); ?>
				</form>
			</div>
		</div>
	</div>
<?php endif; ?>