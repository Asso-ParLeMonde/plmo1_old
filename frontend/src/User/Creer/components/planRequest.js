export async function addPlan(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  updateProject,
  questionIndex
) {
  const questions = project.questions;
  const question = project.questions[questionIndex] || null;
  if (question === null) {
    return;
  }

  question.plans = question.plans || [];
  const newPlan = {
    url: null,
    description: "",
    index: question.plans.reduce((i, p) => (p.index > i ? p.index : i), 0) + 1
  };
  console.log(question.id);
  if (isLoggedIn() && project.id !== null && question.id !== null) {
    const response = await axiosLoggedRequest({
      method: "POST",
      url: "/plans",
      data: {
        description: newPlan.description,
        questionId: question.id,
        index: newPlan.index
      }
    });

    if (response.error) {
      return;
    }

    newPlan.id = response.data.id;
  }

  question.plans.push(newPlan);
  questions[questionIndex] = question;
  updateProject({
    questions
  });
}

export async function editPlan(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  questionIndex,
  planIndex
) {
  const questions = project.questions;
  const question = project.questions[questionIndex] || {};
  question.plans = question.plans || [];
  const plan = question.plans[planIndex] || null;

  if (plan === null) {
    return;
  }

  if (isLoggedIn() && project.id !== null && question.id !== null) {
    const response = await axiosLoggedRequest({
      method: "PUT",
      url: `/plans/${plan.id}`,
      data: {
        description: plan.description
      }
    });
  }
}

export async function deletePlan(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  updateProject,
  questionIndex,
  planIndex
) {
  const questions = project.questions;
  const question = project.questions[questionIndex] || {};
  question.plans = question.plans || [];
  const plan = question.plans[planIndex] || null;

  if (plan === null) {
    return;
  }

  if (isLoggedIn() && project.id !== null && question.id !== null) {
    const response = await axiosLoggedRequest({
      method: "DELETE",
      url: `/plans/${plan.id}`
    });

    if (response.error) {
      return;
    }
  }

  question.plans.splice(planIndex, 1);
  questions[questionIndex] = question;
  updateProject({
    questions
  });
}
