import {customers, scenarios, compare, report} from './model.mjs';
const $ = id => document.getElementById(id);
const labels = {match:'Matches', wrong_customer:'Wrong customer', unresolved:'Cannot resolve', needs_decision:'Choose a rule'};
function render() {
  const scenario = $('scenario').value, method = $('method').value;
  const rows = compare(scenario, method);
  $('scenario-note').textContent = scenarios[scenario].description;
  $('rows').replaceChildren(...rows.map(row => {
    const tr = document.createElement('tr');
    const values = [row.outputIndex, row.sourceIndexes.length ? row.sourceIndexes.join(' + ') : 'None', row.expected ? customers.find(c => c.id === row.expected).name : 'Not a single customer', row.email ?? row.error, labels[row.status]];
    for (const value of values) { const td=document.createElement('td'); td.textContent=String(value); tr.append(td); }
    tr.lastChild.className = row.status === 'match' ? 'good-text' : 'bad';
    return tr;
  }));
  const wrong = rows.filter(r=>r.status==='wrong_customer').length, unresolved=rows.filter(r=>r.status==='unresolved').length;
  const allMatch=rows.every(r=>r.status==='match');
  $('summary').className=allMatch?'good':'';
  $('summary').textContent=allMatch ? 'Every selected customer matches the intended customer in this example.' : wrong ? `${wrong} of ${rows.length} outputs select the wrong customer. An email value is not proof of a correct match.` : unresolved ? 'The recorded links do not identify one customer. Stop and inspect the mapping.' : 'Selecting a value does not decide which customer a combined output should represent.';
  const lessons={first:'Selecting .first() always chooses Ada here. That is appropriate only when the first input is intentionally the target; it does not repair a missing customer relationship.',position:'Selecting by output position assumes the input and output positions mean the same thing. Reordering or filtering can break that assumption.',linked:'Following the recorded link preserves these explicit relationships after reordering or filtering. Missing or multiple links need a deliberate fix; assigning any convenient index is not a safe repair.'};
  $('lesson').textContent=lessons[method];
  $('expression').textContent={first:"$('Customers').first().json.email",position:"$('Customers').all()[$itemIndex].json.email",linked:"$('Customers').item.json.email"}[method];
  $('download-status').textContent='';
}
$('scenario').addEventListener('change',render);$('method').addEventListener('change',render);
$('download').addEventListener('click',()=>{const blob=new Blob([JSON.stringify(report($('scenario').value,$('method').value),null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='item-linking-example.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('download-status').textContent='Download requested. This file records the synthetic example, not an n8n execution.';});
render();
