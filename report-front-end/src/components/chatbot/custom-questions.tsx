import { Link, SpaceBetween } from "@cloudscape-design/components";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@aws-amplify/ui-react";
import styles from "./chat.module.scss";
import { ChatInputState } from "./types";
import { BACKEND_URL } from "../../tools/const";
import { useSelector } from "react-redux";
import { UserState } from "@/types/StoreTypes";

export interface RecommendQuestionsProps {
  setTextValue: Dispatch<SetStateAction<ChatInputState>>;
}

export default function CustomQuestions(props: RecommendQuestionsProps) {

  const [showMoreQuestions, setShowMoreQuestions] = useState(true);
  const [questions, setQuestions] = useState<string[]>([]);

  const userInfo = useSelector<UserState>((state) => state) as UserState;

  const getRecommendQuestions = async (data_profile: string) => {
    const url = `${BACKEND_URL}qa/get_custom_question?data_profile=${data_profile}`;
    try {
      const response = await fetch(url, {
        method: "GET",
      });
      if (!response.ok) {
        console.error("getCustomQuestions Error", response);
        return;
      }
      const result = await response.json();
      const custom_question = result['custom_question'];
      setQuestions(custom_question);
    } catch (error) {
      console.error("getCustomQuestions Error", error);
    }
  }

  useEffect(() => {
    const data_profile = userInfo.queryConfig.selectedDataPro;
    if (data_profile) {
      getRecommendQuestions(data_profile).then();
    }
  }, [userInfo]);

  return (
    <div>
      {questions.length > 0 && showMoreQuestions && (
        <SpaceBetween size={'xxs'}>
          <div className={styles.questions_grid}>
            {questions.slice(0, Math.min(3, questions.length)).map((question, kid) => (
              <Button
                key={kid}
                className={styles.button_border}
                onClick={() => props.setTextValue({value: question})}>
                {question}
              </Button>
            ))}
          </div>
          <div style={{float: 'right'}}>
            <Link
              variant="primary"
              onFollow={
                () => setShowMoreQuestions(false)
              }>
              <p className={styles.text}>More sample suggestions</p>
            </Link>
          </div>
        </SpaceBetween>
      )}
      {questions.length > 0 && !showMoreQuestions && (
        <SpaceBetween size={'xxs'}>
          <div className={styles.questions_grid}>
            {questions.map((question, kid) => (
              <Button
                key={kid}
                className={styles.button_border}
                onClick={() => props.setTextValue({value: question})}>
                {question}
              </Button>
            ))}
          </div>
          <div
            style={{float: 'right'}}>
            <Link
              variant="primary"
              onFollow={
                () => setShowMoreQuestions(true)
              }>
              <p className={styles.text}>Less sample suggestions</p>
            </Link>
          </div>
        </SpaceBetween>
      )}
    </div>
  );
}