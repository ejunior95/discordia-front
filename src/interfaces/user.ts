export interface IUserSocials {
    twitter?: string;
    github?: string;
    linkedin?: string;
}

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    acceptTerms: boolean;
}

export interface IUpdateUser {
    name?: string;
    email?: string;
    password?: string;
    currentPassword?: string;
    bio?: string;
    socials?: IUserSocials;
}