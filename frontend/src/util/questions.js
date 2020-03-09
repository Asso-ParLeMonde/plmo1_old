/*
  Returns the user's questions list with their plans.
  Each question is added a plan list if it has not yet and a planStartIndex to know the plan number.
 */
export function getQuestions(project) {
  return project.questions.reduce((list, current, index) => {
    let newCurrent;
    if (index > 0) {
      const prev = list[index - 1];
      newCurrent = { ...current, planStartIndex: prev.planStartIndex + ((prev.plans || []).length || 1) };
    } else {
      newCurrent = { ...current, planStartIndex: 1 };
    }
    if (newCurrent.plans === undefined || newCurrent.plans === null || newCurrent.plans.length === 0) {
      newCurrent.plans = [
        {
          url: null,
          description: "",
        }
      ];
    }
    list.push(newCurrent);
    return list;
  }, []);
}
