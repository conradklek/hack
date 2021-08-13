customElements.define(
	`hacker-news`,
	class extends HTMLElement {
		async connectedCallback() {
			this.innerHTML = `<article><button id="close" onclick="document.querySelector('hacker-news').classList.remove('read')">Close</button><label for="close" style="display: none">Close</label><ul></ul></article>`;
			fetch(`https://api.hnpwa.com/v0/`)
				.then(data => data.json())
				.then(data => {
					data.endpoints.forEach(endpoint => {
						if (endpoint.maxPages) {
							this.innerHTML += `<input id="${endpoint.topic}" name="tabs" type="radio" ${(endpoint.topic == "news") ? `checked` : ``}/><label for="${endpoint.topic}"><span>${endpoint.topic}</span></label><ol></ol>`
              for (let i = 1; i <= endpoint.maxPages; i++) {
								fetch(`https://api.hnpwa.com/v0/${endpoint.topic}/${i}.json`)
									.then(data => data.json())
									.then(data => data.forEach(item => {
										const link = document.createElement(`li`);
										this.querySelector(`label[for="${endpoint.topic}"] + ol`).appendChild(link);
										link.innerHTML += `\
                      <span>${item.title} ${(item.domain) ? `<a href="${item.url}" target="_blank">${item.domain}</a>` : ``}</span>
                      <div>
                        ${(item.points == 1) ? `<p>${item.points} Point</p>` : ``}
                        ${(item.points > 1) ? `<p>${item.points} Points</p>` : ``}
                        ${(item.user) ? `<p>${item.user}</p>` : ``}
                        <p>${item.time_ago}</p>
                        ${(item.comments_count == 1) ? `<p>${item.comments_count} Comment</p>` : ``}
                        ${(item.comments_count > 1) ? `<p>${item.comments_count} Comments</p>` : ``}
                      </div>`;
										link.querySelector(`div`).onclick = () => {
                      this.classList.toggle(`read`);
                      this.querySelector(`article ul`).scrollTop = 0;
                      fetch(`https://api.hnpwa.com/v0/item/${item.id}.json`)
												.then(data => data.json())
												.then(data => {
													this.querySelector(`article ul`).id = data.id;
                          this.querySelector(`article ul`).innerHTML = `\
                            <h1>${data.title} ${(data.domain) ? `<a href="${data.url}" target="_blank">${data.domain}</a></h1>` : ``}</h1>
                            <div>
                              ${(data.points == 1) ? `<p>${data.points} Point</p>` : ``}
                              ${(data.points > 1) ? `<p>${data.points} Points</p>` : ``}
                              ${(data.user) ? `<p>${data.user}</p>` : ``}
                              <p>${data.time_ago}</p>
                              ${(data.comments_count == 1) ? `<p>${data.comments_count} Comment</p>` : ``}
                              ${(data.comments_count > 1) ? `<p>${data.comments_count} Comments</p>` : ``}
                            </div>
                            ${(data.content) ? `<h4>${data.content}</h4>` : ``}`;
                            
													data.comments.forEach(comment => feed(comment, data.id));
												})
										}
									}))
							}
						}
					})
				})
        function feed(data, target) {
          const item = document.createElement(`li`);
          document.getElementById(target).appendChild(item);
          item.innerHTML = `<div><a href="#${data.id}"><span>${data.user}</span><span>${data.time_ago}</span></a></div>${data.content}`;
          item.id = data.id;
          item.querySelector(`div a`).onclick = () => item.classList.toggle(`hide`);
          data.comments.forEach(comment => feed(comment, data.id))
        }
		}
	}
);