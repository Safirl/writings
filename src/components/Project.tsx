import projects from "../data/projects";
import { useEffect, useState } from "react";
import styles from "../styles/project.module.scss";

interface projectProps {
  id: number;
  onBackButtonPressed: () => void;
  transitionTimer: number;
}

const Project = (props: projectProps) => {
  const { id, onBackButtonPressed, transitionTimer } = props;
  const [projectParagraphs, setProjectParagraphs] =
    useState<{ key: string; value: string }[]>();

  useEffect(() => {
    setTimeout(() => {
      setProjectParagraphs(
        projects.find((project) => project.id == id)?.paragraphs
      );
    }, transitionTimer);
  }, [id]);

  if (!projectParagraphs) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onBackButtonPressed}>retour</button>
      <main className={styles.main}>
        {projectParagraphs.map((paragraph, index) => {
          if (paragraph.key === "h1") {
            return <h1 key={index}>{paragraph.value}</h1>;
          }

          return (
            <p key={index}>
              {paragraph.value.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
          );
        })}
      </main>
      <div className={styles.spacer}></div>
    </div>
  );
};

export default Project;
