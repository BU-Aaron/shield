import { useForm } from '@inertiajs/react';
import GuestLayout from "@/Modules/Common/Layouts/GuestLayout/Guest";
import { Button, TextInput, Title, Text, Select } from '@mantine/core';

interface SecurityQuestionProps {
    username: string;
    questions: { id: string; question: string }[];
}

export default function SecurityQuestion({ username, questions }: SecurityQuestionProps) {
    const { data, setData, post, processing, errors } = useForm({
        security_question_id: "",
        security_question_answer: ""
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('security.question'));
    };

    return (
        <GuestLayout>
            <Title order={2}>Security Question</Title>
            <Text mt={16}>
                Please select your security question and provide your answer.
            </Text>
            <form onSubmit={submit}>
                <Select
                    label="Select Security Question"
                    placeholder="Choose a question"
                    data={questions.map(q => ({ value: String(q.id), label: q.question }))}
                    value={data.security_question_id}
                    onChange={(value) => setData('security_question_id', value || "")}
                    mt={16}
                />
                <TextInput
                    label="Your Answer"
                    name="security_question_answer"
                    value={data.security_question_answer}
                    onChange={(e) => setData('security_question_answer', e.target.value)}
                    error={errors.security_question_answer}
                    mt={16}
                />
                <Button type="submit" loading={processing} mt={16}>
                    Verify
                </Button>
            </form>
        </GuestLayout>
    );
}
