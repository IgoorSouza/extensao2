package com.igorsouza.games.services.mail;

import com.igorsouza.games.dtos.games.GenericGame;

import java.util.List;

public interface MailService {
    void sendDiscountWarningMail(String to, String subject, List<GenericGame> games);
}
