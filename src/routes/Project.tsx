import ProjectForm from "../components/forms/ProjectForm";
import { IAccount } from "../components/shared/IAccount";

export default function CreateProject({ userAccount }: { userAccount: IAccount }) {
    return (
        <ProjectForm userAccount={userAccount}/>
    )
}