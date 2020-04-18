/*
  Returns the user's questions list with their plans.
  Each question is added a plan list if it has not yet and a planStartIndex to know the plan number.
 */
export function getQuestions(project) {
  return project.questions.reduce((list, current, index) => {
    let newCurrent;
    if (index > 0) {
      const prev = list[index - 1];
      newCurrent = {
        ...current,
        planStartIndex: prev.planStartIndex + ((prev.plans || []).length || 1),
      };
    } else {
      newCurrent = { ...current, planStartIndex: 1 };
    }
    if (
      newCurrent.plans === undefined ||
      newCurrent.plans === null ||
      newCurrent.plans.length === 0
    ) {
      newCurrent.plans = [];
    }
    list.push(newCurrent);
    return list;
  }, []);
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
