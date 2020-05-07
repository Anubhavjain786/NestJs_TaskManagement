export function transform(inputs) {
  if (Array.isArray(inputs)) {
    let temp = [];
    for (let i = 0; i < inputs.length; i++) {
      temp.push(transformEntity(inputs[i]));
    }
    return temp;
  } else {
    return transformEntity(inputs);
  }
}

function transformEntity(inputs) {
  return {
    id: inputs.uuid,
    title: inputs.title,
    description: inputs.description,
    status: inputs.status,
  };
}
