import projects from "../data/projects"
import { useEffect, useState } from "react"
import styles from "../styles/project.module.scss"

interface projectProps {
    id: number
    onBackButtonPressed: () => void
}

const Project = (props: projectProps) => {
    const { id, onBackButtonPressed } = props
    const [projectParagraphs, setProjectParagraphs] = useState<{ key: string, value: string }[]>()

    useEffect(() => {
        setProjectParagraphs(projects.find((project) => project.id == id)?.paragraphs)
        console.log("projectParagraphs", projectParagraphs)
    }, [props.id])

    if (!projectParagraphs) {
        return (<></>)
    };

    return (
        <main className={styles.container}>
            <button onClick={onBackButtonPressed}>retour</button>
            {projectParagraphs.map((paragraph, index) => {
                if (paragraph.key === "h1") {
                    return <h1 key={index}>{paragraph.value}</h1>
                }
                return <p key={index}>{paragraph.value}</p>
            })}
        </main>
    )
}

export default Project