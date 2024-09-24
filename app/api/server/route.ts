'use server'

import { signIn, signOut } from "auth";

export const loginAction = async (formData: any)=>{
    console.log("inside the server");

    const username = formData.get('username');
    const password = formData.get('password');
    const provider = formData.get('provider');

    console.log(provider, username, password);

    await signIn(provider, {redirectTo: "/dashboard"});
}

export const logOutAction = async ()=>{
    console.log("signout buton clicked...")

    await signOut({redirectTo: "/"});
}