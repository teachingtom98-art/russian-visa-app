import re

with open('app.js', 'r') as f:
    content = f.read()

# Replace variables in the template string with escaped versions
search = """    li.innerHTML = `
      <div class="task-top-row">
        <div class="task-main">
          <div class="task-title-wrap">
            <span class="task-title" onclick="toggleTaskStatus(${index})">
              ${task.title}
            </span>
          </div>
          <p class="task-hint">${task.hint}</p>
          <div class="task-meta-tags">
            ${task.source ? `<a href="${task.sourceUrl || '#'}" target="_blank" rel="noopener noreferrer" class="source-tag">Source: ${task.source} &nearr;</a>` : ''}
            ${task.verifiedDate ? `<span class="verified-tag">&bull; Verified: ${task.verifiedDate}</span>` : ''}
          </div>
        </div>"""

replace = """    li.innerHTML = `
      <div class="task-top-row">
        <div class="task-main">
          <div class="task-title-wrap">
            <span class="task-title" onclick="toggleTaskStatus(${index})">
              ${escapeHtml(task.title)}
            </span>
          </div>
          <p class="task-hint">${escapeHtml(task.hint)}</p>
          <div class="task-meta-tags">
            ${task.source ? `<a href="${sanitizeUrl(task.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="source-tag">Source: ${escapeHtml(task.source)} &nearr;</a>` : ''}
            ${task.verifiedDate ? `<span class="verified-tag">&bull; Verified: ${escapeHtml(task.verifiedDate)}</span>` : ''}
          </div>
        </div>"""

content = content.replace(search, replace)


search_guidance = """    } else {
      guidanceHtml = `
        <details class="task-guidance-details">
          <summary class="task-guidance-summary">Requirements & preparation guidance</summary>
          <div class="task-guidance-text">
            <p>${task.guidance}</p>
          </div>
        </details>
      `;
    }"""

replace_guidance = """    } else {
      guidanceHtml = `
        <details class="task-guidance-details">
          <summary class="task-guidance-summary">Requirements & preparation guidance</summary>
          <div class="task-guidance-text">
            <p>${escapeHtml(task.guidance)}</p>
          </div>
        </details>
      `;
    }"""

content = content.replace(search_guidance, replace_guidance)


with open('app.js', 'w') as f:
    f.write(content)
