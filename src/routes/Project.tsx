import ProjectForm from "../components/forms/ProjectForm";

export default function CreateProject({ userAccount }: { userAccount: string }) {
    return (
        <ProjectForm userAccount={userAccount}/>
    )
}