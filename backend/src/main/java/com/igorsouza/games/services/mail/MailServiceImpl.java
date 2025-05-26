package com.igorsouza.games.services.mail;

import com.igorsouza.games.dtos.games.GenericGame;
import freemarker.template.Configuration;
import freemarker.template.Template;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MailServiceImpl implements MailService {

    private final JavaMailSender mailSender;
    private final Configuration freemarkerConfig;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Override
    public void sendDiscountWarningMail(String to, String subject, List<GenericGame> games) throws MailException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Template template = freemarkerConfig.getTemplate("discount-email.ftl");

            Map<String, Object> model = new HashMap<>();
            model.put("games", games);

            StringWriter html = new StringWriter();
            template.process(model, html);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html.toString(), true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void sendVerificationMail(String to, String subject, String token) throws MailException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            Template template = freemarkerConfig.getTemplate("verification-email.ftl");

            Map<String, Object> model = new HashMap<>();
            model.put("token", token);
            model.put("link", frontendUrl + "/auth/verify?token=" + token);

            StringWriter html = new StringWriter();
            template.process(model, html);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html.toString(), true);

            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
