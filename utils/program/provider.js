// utils/blockchain.ts
import * as anchor from "@project-serum/anchor";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import idl from "utils/program/idl.json";

const programID = new anchor.web3.PublicKey("7CrcbfqyecWEZXDGXVtQMDDeyjcHtScSjCLecgbPtAQC");
const commitment = "processed";

const getProvider = (connection, wallet) => {
    const provider = new anchor.AnchorProvider(connection, wallet, {
        preflightCommitment: commitment
    });
    const program = new anchor.Program(JSON.parse(JSON.stringify(idl)), programID, provider);

    return program;
};

export default getProvider;
