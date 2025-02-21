<?php

namespace Modules\User\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Password;

class NewUserNotification extends Notification
{
    protected string $password;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $password)
    {
        $this->password = $password;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {
        // Generate a password reset URL with email included as a signed parameter
        $passwordResetUrl = URL::temporarySignedRoute(
            'password.reset',
            Carbon::now()->addMinutes(60),
            [
                'token' => Password::createToken($notifiable),
                'email' => $notifiable->email,
            ]
        );

        return (new MailMessage)
            ->subject('Your New Account Details')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your account has been created successfully. Below are your login details:')
            ->line('**Email:** ' . $notifiable->email)
            ->line('**Password:** ' . $this->password)
            ->action('Reset Your Password', $passwordResetUrl)
            ->line('Please reset your password as soon as possible.');
    }
}
