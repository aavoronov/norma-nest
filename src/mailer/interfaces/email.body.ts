export interface IEmailRegister {
  verification: string;
  email: string;
}
export interface IPasswordRestore {
  email: string;
  token: string;
}

export interface IEmailChatAdApproval {
  email: string;
  description: string;
}
