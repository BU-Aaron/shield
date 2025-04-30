import internal from "stream";

export interface RegisterUserData {
    name: string;
    username: string;
    email: string;
    office_position?: string;
    workflow_role?: string;
    system_role: string;
    password: string;
    security_question_id: string;
    security_question_answer: string;
}
