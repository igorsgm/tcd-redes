<?php // Este template é chamado na viewdefault ?>
<div role="tabpanel" class="tab-pane" id="consultar_chamado">
	<div class="panel panel-default">

		<div class="panel-heading">
			<h4>
				<strong><?php echo JText::_('COM_OUVIDORIA_CONSULTAR_CHAMADO'); ?></strong>
			</h4>
		</div>
		<div class="panel-body">
			<form action="" method="POST" role="form" class="form-validate" action="<?php echo JRoute::_('index.php?option=com_ouvidoria&task=solicitante.consult'); ?>">
				<small class="tip">
					<em><?php echo JText::_('COM_OUVIDORIA_REQUIRED_TIP'); ?></em>
				</small>
				<div class="row">
					<div class="col-sm-3">
						<div class="control-group">
							<label for="">CPF do solicitante*</label>
							<div class="controls">
								<input type="text" class="form-control" id="jform_cpf_consulta" name="jform[cpf]" placeholder="CPF do solicitante" value="<?php echo !empty($this->solicitante->cpf) ? $this->solicitante->cpf : ''; ?>">
							</div>
						</div>
					</div>
					<div class="col-sm-3">
						<div class="control-group">
							<label for="">Número do protocolo*</label>
							<div class="controls">
								<input type="text" class="form-control" id="jform_protocolo_consulta" name="jform[protocolo]" placeholder="Número do protoloco">
							</div>
						</div>
					</div>
					<div class="col-sm-3">
						<label for="">&nbsp;</label>
						<div class="control-group">
							<div class="controls">
								<button type="submit" class="btn btn-primary"><?php echo JText::_('COM_OUVIDORIA_OUVIDORIA_BTN_SEARCH_SUBMIT'); ?></button>
							</div>
						</div>
					</div>
				</div>

				<input type="hidden" name="option" value="com_ouvidoria"/>
				<input type="hidden" name="task" value="solicitacaoform.consult"/>
				<?php echo JHtml::_('form.token'); ?>

			</form>
		</div>
	</div>
</div>