<?php

namespace Modules\Auth\Controllers;

use Modules\Common\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\User\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Modules\Auth\Models\SecurityQuestion;

class ForgotPasswordSecurityController extends Controller
{
    // Show the form to enter the username
    public function showUsernameForm(): Response
    {
        return Inertia::render('ForgotPasswordUsername');
    }

    // Process the username and then redirect to the security question form
    public function processUsername(Request $request)
    {
        $request->validate([
            'username' => 'required|string|exists:users,username',
        ]);

        $user = User::where('username', $request->input('username'))->first();

        if (!$user || !$user->security_question_id) {
            throw ValidationException::withMessages([
                'username' => 'No security question set for this user.',
            ]);
        }

        // Save the username in session for later steps
        session(['password_reset_username' => $user->username]);

        // Get the security question text via relationship
        $question = $user->securityQuestion->question ?? 'Security question not found';

        return redirect()->route('security.question')->with('question', $question);
    }

    // Show the form to answer the security question
    public function showSecurityQuestionForm(Request $request)
    {
        if (!session('password_reset_username')) {
            return redirect()->route('password.username');
        }
        // Retrieve all available security questions (adjust fields as needed)
        $questions = SecurityQuestion::all(['id', 'question']);

        return Inertia::render('SecurityQuestion', [
            'username'  => $request->input('username'),
            'questions' => $questions,
        ]);
    }

    // Process the answer to the security question
    public function processSecurityAnswer(Request $request)
    {
        $request->validate([
            'security_question_id' => 'required|exists:security_questions,id',
            'security_question_answer' => 'required|string',
        ]);

        $username = session('password_reset_username');
        if (!$username) {
            return redirect()->route('password.username');
        }

        $user = User::where('username', $username)->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'username' => 'User not found.',
            ]);
        }

        // Check that the submitted security question ID matches the one on record
        if ($user->security_question_id != $request->input('security_question_id')) {
            return redirect()->back()->withErrors(['security_question_answer' => 'Invalid choice'])->withInput();
        }

        if (!Hash::check($request->input('security_question_answer'), $user->security_question_answer)) {
            throw ValidationException::withMessages([
                'security_question_answer' => 'Invalid choice.',
            ]);
        }

        // Mark the security question as verified for this session
        session(['security_verified' => true]);

        return redirect()->route('password.manual');
    }

    // Show the form to update the password once security is verified
    public function showResetPasswordForm(Request $request)
    {
        if (!session('security_verified')) {
            return redirect()->route('password.username');
        }

        $username = session('password_reset_username');
        return Inertia::render('ResetPasswordManual', [
            'username' => $username,
        ]);
    }

    // Update the user's password
    public function updatePassword(Request $request)
    {
        if (!session('security_verified')) {
            return redirect()->route('password.username');
        }

        $username = session('password_reset_username');

        $request->validate([
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $user = User::where('username', $username)->first();
        if (!$user) {
            throw ValidationException::withMessages([
                'username' => 'User not found.',
            ]);
        }

        $user->update([
            'password' => Hash::make($request->input('password')),
        ]);

        // Clear the related session entries
        session()->forget(['password_reset_username', 'security_verified']);

        return redirect()->route('login')->with('status', 'Password updated successfully.');
    }
}
