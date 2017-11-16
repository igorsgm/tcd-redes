<?php
/**
 * @package     Thomisticus.Library
 * @subpackage  Helper
 *
 * @copyright   Copyright (C) 2017-2021 Igor Moraes. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE
 */

defined('_JEXEC') or die;

/**
 * Mail helper
 *
 * @package     Thomisticus.Library
 * @subpackage  Helper
 * @since       1.0
 */
abstract class ThomisticusHelperMail
{

    /**
     * Generic method to send e-mail in Joomla
     *
     * @param string       $subject     Email subject
     * @param string       $body        Email body
     * @param string|array $recipients  Who will receive the email (single email or array of emails)
     * @param string       $mailFrom    Sender email(if not provided will fetch the site's email address from the global configuration)
     * @param string       $fromName    Sender name (if not provided will fetch the site's name from the global configuration_
     * @param bool         $isHtml      If email body is in HTML format
     * @param string       $encoding    When sending HTML emails you should normally set the Encoding to base64
     *                                  in order to avoid unwanted characters in the output
     * @param string|array $attachments Email attachments (single string path or array of paths)
     */
    public static function sendMail($subject, $body, $recipients, $mailFrom = '', $fromName = '', $isHtml = false, $encoding = '', $attachments = array())
    {
        $app = JFactory::getApplication();

        $mail = JFactory::getMailer()
            ->setSender(
                array(
                    (!empty($mailFrom) ? $mailFrom : $app->get('mailfrom')),
                    (!empty($fromName) ? $fromName : $app->get('fromname'))
                )
            )
            ->isHtml($isHtml);

        if ($isHtml) {
            $mail->Encoding = !empty($encoding) ? $encoding : 'base64';
        }

        $mail->addRecipient($recipients)->setSubject($subject)->setBody($body);

        if (!empty($attachments)) {
            $mail->addAttachment($attachments);
        }

        if (!$mail->Send()) {
            $app->enqueueMessage(JText::_('JERROR_SENDING_EMAIL'), 'warning');
        }
    }
}
