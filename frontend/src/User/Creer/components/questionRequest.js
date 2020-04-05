export async function addQuestion(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  updateProject,
  newQuestion
) {
  let question = {
    isDefault: false,
    languageCode: project.languageCode,
    question: newQuestion,
    scenarioId: project.scenarioId
  };

  if (isLoggedIn() && project.id !== null) {
    const response = await axiosLoggedRequest({
      method: "POST",
      url: "/questions",
      data: {
        index: project.questions.length,
        isDefault: false,
        languageCode: project.languageCode,
        question: newQuestion,
        scenarioId: project.scenarioId,
        projectId: project.id
      }
    });
    if (!response.error) {
      question = response.data;
    } else {
      question.id = Math.max(0, ...project.questions.map(q => q.id)) + 1;
    }
  } else {
    question.id = Math.max(0, ...project.questions.map(q => q.id)) + 1;
  }

  updateProject({
    questions: [...project.questions, question]
  });
}

export async function editQuestion(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  updateProject,
  question,
  questionIndex
) {
  const questions = project.questions;
  if (isLoggedIn() && project.id !== null) {
    await axiosLoggedRequest({
      method: "PUT",
      url: `/questions/${questions[questionIndex].id}`,
      data: {
        question,
        index: questionIndex
      }
    });
  }
  questions[questionIndex].question = question;
  questions[questionIndex].index = questionIndex;
  updateProject({ questions });
}

export async function deleteQuestion(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  questionIndex,
  setQuestion
) {
  const questions = project.questions;
  if (isLoggedIn() && project.id !== null) {
    await axiosLoggedRequest({
      method: "DELETE",
      url: `/questions/${questions[questionIndex].id}`
    });
  }
  questions.splice(questionIndex, 1);
  setQuestion(questions);
}
