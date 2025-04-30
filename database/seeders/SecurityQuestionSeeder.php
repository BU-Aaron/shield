<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Auth\Models\SecurityQuestion;

class SecurityQuestionSeeder extends Seeder
{
    public function run(): void
    {
        $questions = [
            "What is your mother's maiden name?",
            "What is the name of your first pet?",
            "What is your father's name?",
            "What city were you born in?",
            "What was the name of your elementary school?",
        ];

        foreach ($questions as $question) {
            SecurityQuestion::updateOrCreate(['question' => $question]);
        }
    }
}
