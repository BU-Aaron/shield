<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Auth\Models\SecurityQuestion;

class SecurityQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            'What was your childhood nickname?',
            'What is the name of your favorite childhood friend?',
            'What was your dream job as a child?',
            'What is the name of your first pet?',
            'What is your mother\'s maiden name?',
        ];

        foreach ($questions as $question) {
            SecurityQuestion::updateOrCreate(['question' => $question]);
        }
    }
}
