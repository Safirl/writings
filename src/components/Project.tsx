import projects from "../data/projects";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/project.module.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import clsx from "clsx";

interface projectProps {
  id: number;
  onBackButtonPressed: () => void;
  transitionTimer: number;
}

const Project = (props: projectProps) => {
  const refMainContainer = useRef<HTMLElement>(null!);
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

  useGSAP(() => {
    if (!refMainContainer.current) return;
    const paragraphs = Array.from(
      refMainContainer.current.children
    ) as HTMLElement[];

    let index = 0;
    paragraphs.forEach((paragraph) => {
      gsap.to(paragraph.style, {
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
        delay: index * 0.15,
      });
      index++;
    });
  }, [projectParagraphs]);

  if (!projectParagraphs) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={onBackButtonPressed}>
        retour
      </button>
      <main className={styles.main} ref={refMainContainer}>
        {projectParagraphs.map((paragraph, index) => {
          if (paragraph.key === "h1") {
            return (
              <h1 key={index} style={{ opacity: 0 }}>
                {paragraph.value}{" "}
              </h1>
            );
          }

          return (
            <p key={index} style={{ opacity: 0 }}>
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
