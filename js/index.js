document.addEventListener("DOMContentLoaded", () => {
    const categoryButtons = {
        all: document.getElementById("allButton"),
        music: document.getElementById("musicButton"),
        comedy: document.getElementById("comedyButton"),
        drawing: document.getElementById("drawingButton"),
    };

    const cardContainer = document.getElementById("card-container");
    const categoryContainer = document.getElementById("category-container");

    function formatTime(seconds) {
        if (seconds < 60) {
            return "";
        }

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        let formattedTime = "";

        if (hours > 0) {
            formattedTime += hours + "hrs";
            if (minutes > 0) {
                formattedTime += " ";
            }
        }

        if (minutes > 0) {
            formattedTime += minutes + "min";
        }

        formattedTime += " ago";

        return formattedTime;
    }

    const fetchAndDisplayCategoryData = async () => {
        const categoriesUrl =
            "https://openapi.programming-hero.com/api/videos/categories";

        try {
            const response = await fetch(categoriesUrl);
            const responseData = await response.json();

            if (response.ok) {
                const categories = responseData.data;

                categories.forEach((category) => {
                    const categoryButton = document.createElement("button");
                    categoryButton.classList.add(
                        "bg-pink-200",
                        "border",
                        "stroke-lime-50",
                        "w-16"
                    );
                    categoryButton.textContent = category.category;
                    categoryButton.setAttribute(
                        "data-category-id",
                        category.category_id
                    );

                    categoryButton.addEventListener("click", () => {
                        fetchAndDisplayVideoData(category.category_id);
                    });

                    categoryContainer.appendChild(categoryButton);
                });

                fetchAndDisplayVideoData("1000");
            } else {
                console.error(
                    "Failed to fetch categories:",
                    responseData.message
                );
            }
        } catch (error) {
            console.error(
                "An error occurred while fetching categories:",
                error
            );
        }
    };

    const fetchAndDisplayVideoData = async (categoryId) => {
        const categoryUrl = `https://openapi.programming-hero.com/api/videos/category/${categoryId}`;

        try {
            const response = await fetch(categoryUrl);
            const responseData = await response.json();

            if (response.ok) {
                const videos = responseData.data;

                cardContainer.innerHTML = "";

                if (videos.length === 0) {
                    const noDataMessage = document.createElement("div");
                    noDataMessage.classList.add("no-data-message");
                    noDataMessage.innerHTML = `
                  
                     <section class="flex justify-center items-center w-screen">
                     <div> 
                         <div >
                          <img src="./Icon.png" alt="" />
                         </div>
                          <div>
                               <p>Oops!! Sorry, There is no content here</p>
                           </div>
                       </div>
                      </section>
                  
                    `;
                    cardContainer.appendChild(noDataMessage);
                } else {
                    videos.forEach((video) => {
                        const card = document.createElement("div");
                        card.classList.add("card", "w-72", "bg-gray-100");

                        const authorsHtml = video.authors
                            .map(
                                (author) => `
                                    <div class="author">
                                        <p class="flex items-center">
                                            ${author.profile_name}
                                            ${
                                                author.verified
                                                    ? '<img src="./verified img.jpg" alt="Verified" class="w-4 h-4 ml-1" />'
                                                    : ""
                                            }
                                        </p>
                                        <img src="${
                                            author.profile_picture
                                        }" alt="${
                                    author.profile_name
                                }" class="w-10 h-10 rounded-3xl " />
                                    </div>
                                `
                            )
                            .join("");

                        const postedTimeInSeconds = video.others.posted_date;
                        const formattedTime = formatTime(postedTimeInSeconds);

                        card.innerHTML = `
                            <div class="thumbnail-container relative">
                                <figure>
                                    <img src="${video.thumbnail}" alt="${
                            video.title
                        }" />
                                </figure>
                                ${
                                    formattedTime
                                        ? `<p class="posted-time-badge absolute bottom-0 right-0 bg-gray-200 p-1 text-xs">${formattedTime}</p>`
                                        : ""
                                }
                            </div>
                            <div class="card-body">
                                <h2 class="card-title">${video.title}</h2>
                                <div class="authors">${authorsHtml}</div>
                                <p class="views">Views: ${
                                    video.others.views
                                }</p>
                            </div>
                        `;

                        cardContainer.appendChild(card);
                    });
                }
            } else {
                console.error(
                    `Failed to fetch data for category ${categoryId}`
                );
            }
        } catch (error) {
            console.error("An error occurred while fetching data:", error);
        }
    };

    fetchAndDisplayCategoryData();

    const sortByViewButton = document.getElementById("sort-by-view-button");

    sortByViewButton.addEventListener("click", () => {
        const cards = Array.from(cardContainer.querySelectorAll(".card"));

        cards.sort((a, b) => {
            const viewsA = parseInt(
                a
                    .querySelector(".views")
                    .textContent.split(":")[1]
                    .trim()
                    .replace("K", "000")
            );
            const viewsB = parseInt(
                b
                    .querySelector(".views")
                    .textContent.split(":")[1]
                    .trim()
                    .replace("K", "000")
            );
            return viewsB - viewsA;
        });

        cardContainer.innerHTML = "";

        cards.forEach((card) => {
            cardContainer.appendChild(card);
        });
    });
});
