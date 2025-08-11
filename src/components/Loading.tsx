import styles from "../styles/loading.module.scss";
import { useProgress } from "@react-three/drei";

const Loading = () => {
  const { progress } = useProgress()
  return (
    <div className={styles.container}>
      <h1>Loading</h1>
      <progress className={styles.loader} value={progress} max={100}></progress>
    </div>
  )
};

export default Loading;
