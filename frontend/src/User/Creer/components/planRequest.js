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
    index: question.plans.reduce((i, p) => (p.index > i ? p.index : i), 0) + 1,
  };

  if (isLoggedIn() && project.id !== null && question.id !== null) {
    const response = await axiosLoggedRequest({
      method: "POST",
      url: "/plans",
      data: {
        description: newPlan.description,
        questionId: question.id,
        index: newPlan.index,
      },
    });

    if (response.error) {
      return;
    }

    newPlan.id = response.data.id;
  }

  question.plans.push(newPlan);
  questions[questionIndex] = question;
  updateProject({
    questions,
  });
}

export async function editPlan(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  questionIndex,
  planIndex
) {
  const question = project.questions[questionIndex] || {};
  question.plans = question.plans || [];
  const plan = question.plans[planIndex] || null;

  if (plan === null) {
    return;
  }

  if (isLoggedIn() && project.id !== null && question.id !== null) {
    await axiosLoggedRequest({
      method: "PUT",
      url: `/plans/${plan.id}`,
      data: {
        description: plan.description,
      },
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
      url: `/plans/${plan.id}`,
    });

    if (response.error) {
      return;
    }
  }

  question.plans.splice(planIndex, 1);
  questions[questionIndex] = question;
  updateProject({
    questions,
  });
}

async function uploadTemporaryImage(axiosLoggedRequest, imageBlob) {
  const bodyFormData = new FormData();
  bodyFormData.append("image", imageBlob);

  try {
    const response = await axiosLoggedRequest({
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      url: "/plans/temp-image",
      data: bodyFormData,
    });
    if (!response.error) {
      return response.data.path || null;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

async function uploadImage(axiosLoggedRequest, imageBlob, planId) {
  const bodyFormData = new FormData();
  bodyFormData.append("image", imageBlob);

  try {
    const response = await axiosLoggedRequest({
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      url: `/plans/${planId}/image`,
      data: bodyFormData,
    });
    if (!response.error) {
      return response.data.url || null;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
}

export async function uploadPlanImage(
  axiosLoggedRequest,
  isLoggedIn,
  project,
  updateProject,
  questionIndex,
  planIndex,
  imageBlob
) {
  const questions = project.questions;
  const question = project.questions[questionIndex] || {};
  question.plans = question.plans || [];
  const plan = question.plans[planIndex] || null;

  if (plan === null) {
    return;
  }

  if (isLoggedIn() && project.id !== null && question.id !== null && plan.id) {
    plan.url = await uploadImage(axiosLoggedRequest, imageBlob, plan.id);
  } else {
    plan.url = await uploadTemporaryImage(
      axiosLoggedRequest,
      imageBlob,
      plan.id
    );
  }

  questions[questionIndex].plans[planIndex] = plan;
  updateProject({
    questions,
  });
}
