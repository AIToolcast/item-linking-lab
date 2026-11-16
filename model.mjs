// A deliberately small teaching model, not the n8n execution engine.
export const customers = Object.freeze([
  Object.freeze({id: 'C-101', name: 'Ada', email: 'ada@example.invalid'}),
  Object.freeze({id: 'C-202', name: 'Ben', email: 'ben@example.invalid'}),
  Object.freeze({id: 'C-303', name: 'Cam', email: 'cam@example.invalid'}),
]);
export const scenarios = Object.freeze({
  reordered: {title: 'Reordered items', description: 'The output order is Cam, Ada, Ben. Each output still records its original input index.', items: [{expected: 2, links: [2]}, {expected: 0, links: [0]}, {expected: 1, links: [1]}]},
  filtered: {title: 'Filtered items', description: 'Ada was removed. Ben and Cam keep their original input indexes, 1 and 2.', items: [{expected: 1, links: [1]}, {expected: 2, links: [2]}]},
  missing: {title: 'Missing link', description: 'A constructed output for Cam has no link metadata. This models an already broken link, not every Code node without pairedItem.', items: [{expected: 2, links: []}]},
  combined: {title: 'Combined items', description: 'One output represents both Ada and Ben. There is no single intended customer: you must define what the downstream step should do.', items: [{expected: null, links: [0, 1]}]},
});
export const methods = Object.freeze({linked: 'Follow the recorded link', first: 'Always select the first input', position: 'Use the output position'});
export function compare(scenario, method) {
  if (!Object.hasOwn(scenarios, scenario) || !Object.hasOwn(methods, method)) throw new Error('Choose a known scenario and method.');
  return scenarios[scenario].items.map((item, outputIndex) => {
    let index = null;
    let error = null;
    if (method === 'linked') {
      if (!item.links.length) error = 'Missing link';
      else if (item.links.length > 1) error = 'Ambiguous link';
      else index = item.links[0];
    } else index = method === 'first' ? 0 : outputIndex;
    const selected = index === null ? null : customers[index];
    const expected = item.expected === null ? null : customers[item.expected];
    const status = error ? 'unresolved' : !expected ? 'needs_decision' : selected?.id === expected.id ? 'match' : 'wrong_customer';
    return {outputIndex, sourceIndexes: [...item.links], expected: expected?.id ?? null, selected: selected?.id ?? null, email: selected?.email ?? null, status, error};
  });
}
export function report(scenario, method) {
  return {tool: 'Item Linking Lab', version: '0.1.0', kind: 'constructed_educational_model', n8n_runtime_test: false, scenario, method, rows: compare(scenario, method), limitation: 'Synthetic single-input teaching example. Does not inspect or execute n8n workflows, validate real customer relationships, or model all automatic linking, branches, loops, runs and subworkflows.'};
}
