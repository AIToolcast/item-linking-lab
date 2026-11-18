# Filtered customers in Item Linking Lab

Removing the first input changes the output positions of the remaining items. This example shows what happens when a downstream lookup uses those new positions to index the original customer list.

Original input order is Ada (`C-101`), Ben (`C-202`), Cam (`C-303`). The filter removes Ada and retains Ben and Cam in that order. Their recorded source indexes remain 1 and 2.

| Output position | Intended customer | Lookup by output position | Lookup by recorded source |
| --- | --- | --- | --- |
| 0 | Ben (`C-202`) | Ada (`C-101`) | Ben (`C-202`) |
| 1 | Cam (`C-303`) | Ben (`C-202`) | Cam (`C-303`) |

## Reproduce the comparison

In the [browser lab](https://aitoolcast.com/tools/item-linking-lab/?utm_source=github&utm_campaign=item-linking-example), select **Filtered items** and **Use the output position**. Compare the intended customers with the selected emails, then switch to **Follow the recorded link**. The lab can download the result for each selection.

From the repository root, use Node.js to generate both results without credentials or network requests.

```sh
node --input-type=module -e 'import {report} from "./model.mjs"; console.log(JSON.stringify({output_position:report("filtered","position"),recorded_link:report("filtered","linked")},null,2))'
node --test model.test.mjs
```

The [saved comparison](comparison.json) came from a direct run of the v0.1.0 teaching model on November 18, 2026, Eastern, using Node.js v22.15.0. Ten model tests passed. The two rows are fictional. No n8n expression, real workflow, email delivery, or production integration was run. The comparison assumes the displayed links are correct.

In an actual workflow, inspect item ancestry and match a stable business identifier before relying on a downstream address. n8n documents when it can preserve links across filtering and when a Code node creating new items needs explicit pairing. See [n8n item linking](https://docs.n8n.io/build/work-with-data/reference-data/link-data-items/how-items-link-through-workflows/) and [Code node pairing](https://docs.n8n.io/build/work-with-data/reference-data/link-data-items/preserving-linking-in-the-code-node/).

[Read the AI Toolcast walkthrough](https://aitoolcast.com/articles/n8n-item-linking-filter-output-position/?utm_source=github&utm_medium=referral&utm_campaign=item-linking-example).
