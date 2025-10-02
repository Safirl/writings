import styles from "../styles/loading.module.scss";
import {useProgress} from "@react-three/drei";
import {useEffect, useRef, useState} from "react";

const Loading = () => {
    const {progress} = useProgress()
    const containerRef = useRef<HTMLDivElement>(null);
    const [isCompleted, setIscompleted] = useState(false);

    useEffect(() => {
        if (progress >= 100 && !isCompleted) {
            if (!containerRef.current) return;
            containerRef.current.classList.remove(styles.fadeInElement)
            containerRef.current.classList.add(styles.fadeOutElement)
            setIscompleted(true);
            console.log(progress);
        }
    }, [progress])

    return (
        <div className={`${styles.container} ${styles.fadeInElement}`} ref={containerRef} style={{position: "absolute", zIndex: "200"}}>
            <h1>Loading</h1>
            <progress className={styles.loader} value={progress} max={100}></progress>
        </div>
    )
};

export default Loading;
