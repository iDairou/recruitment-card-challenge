export default function () {
	const elements = {
		form: {
			number: document.querySelector("#card-number"),
			holder: document.querySelector("#card-name"),
			cvv: document.querySelector("#cvv"),
			month: document.querySelector("#expiration-month"),
			year: document.querySelector("#expiration-year"),
			inputs: document.querySelectorAll(".card__form--input"),
		},
		card: {
			wrapper: document.querySelector(".card__wrapper"),
			digits: document.querySelectorAll(".card__digit"),
			holder: document.querySelector(".card__preview--holder--char"),
			month: document.querySelector(".card__previev--expires--box--month"),
			year: document.querySelector(".card__previev--expires--box--year"),
			cvv: document.querySelector(".card__preview--cvv-box"),
			logos: document.querySelectorAll(".card__preview--logo img"),
		},
		border: document.querySelector(".moving-border"),
	};
	const { number, holder, month, year } = elements.form;
	const initBorder = {
		width: "100%",
		height: "100%",
		left: "50%",
		top: "50%",
	};

	const borderConfigs = [
		{
			input: number,
			styles: {
				width: " 89%",
				left: "47%",
				top: "50%",
				height: "15%",
			},
		},

		{
			input: holder,
			styles: {
				width: "66%",
				height: "19%",
				top: "81.5%",
				left: "36%",
			},
		},
		{
			input: [month, year],
			styles: {
				width: "16%",
				height: "19%",
				top: "81.5%",
				left: "89%",
			},
		},
	];

	const toggleBorderClass = (element, className, isAdding) => {
		isAdding
			? element?.classList.add(className)
			: element?.classList.remove(className);
	};
	const setStyles = (border, styles) => {
		Object.entries(styles).forEach(([property, value]) => {
			border.style[property] = value;
		});
	};

	const initializeBorder = (configs) => {
		configs.forEach(({ input, styles }) => {
			const inputs = Array.isArray(input) ? input : [input];
			const border = elements.border;

			inputs.forEach((singleInput) => {
				singleInput.addEventListener("focus", () => {
					setStyles(border, styles);
					toggleBorderClass(border, "active", true);
				});

				singleInput.addEventListener("blur", () => {
					toggleBorderClass(border, "active", false);

					//reset
					setStyles(border, initBorder);
				});
			});
		});
	};

	const logoPatterns = {
		visa: /^4/,
		mastercard: /^5[1-5]|^2[2-7]/,
	};

	let currentCardType = "visa";

	const identifyLogoImage = (number) => {
		const { visa, mastercard } = logoPatterns;
		if (visa.test(number)) {
			return "visa";
		} else if (mastercard.test(number)) {
			return "mastercard";
		} else {
			return "visa";
		}
	};

	const handleLogoChange = (number) => {
		const { logos } = elements.card;
		if (!logos) return;
		const cardLogo = identifyLogoImage(number);
		if (cardLogo !== currentCardType) {
			currentCardType = cardLogo;

			const imagesArr = Array.from(logos);
			imagesArr.forEach((image) => {
				image.classList.remove("rise-up");
				image.src = `/images/${cardLogo}.png`;
				void image.getBoundingClientRect();
				image.classList.add("rise-up");
			});
		}
	};

	const fomatInputValue = (value) => {
		let formattedValue = "";
		for (let i = 0; i < value.length; i++) {
			if (i > 0 && i % 4 === 0) {
				formattedValue += " ";
			}
			formattedValue += value[i];
		}
		return formattedValue;
	};

	const updateCardNumber = (e) => {
		const value = e.target.value.replace(/\D/g, "").slice(0, 16);

		e.target.value = fomatInputValue(value);

		handleLogoChange(value);
		elements.card.digits.forEach((span, index) => {
			const isRising = span.classList.contains("fall-in");
			const isFalling = span.classList.contains("rise-up");

			span.classList.remove(isRising ? "fall-in" : "rise-up");

			if (index < value.length) {
				span.textContent = value[index];
				span.classList.add("rise-up");
			} else {
				span.textContent = "#";
				span.classList.add(isFalling ? "fall-in" : null);
			}
		});
	};

	const updateCardName = (e) => {
		const { holder } = elements.card;
		const maxLength = 20;
		let value = e.target.value
			.toUpperCase()
			.replace(/[^A-Z\s]/g, "")
			.replace(/\s{2,}/g, " ");

		if (value.length > maxLength) {
			value = value.slice(0, maxLength);
		}
		e.target.value = value;

		while (holder.firstChild) {
			holder.removeChild(holder.firstChild);
		}

		if (value.length === 0) {
			holder.textContent = "AD SOYAD";
		} else {
			for (let i = 0; i < value.length; i++) {
				const charElement = document.createElement("span");
				charElement.classList.add("card__preview--holder--char");
				charElement.textContent = value[i];
				if (i === value.length - 1) {
					charElement.classList.add("slide-from-right");
				}
				holder.appendChild(charElement);
			}
		}
	};

	const updateCardMonth = (e) => {
		const { month } = elements.card;
		const { year: yearInput } = elements.form;

		const selectedMonth = parseInt(e.target.value, 10);
		const selectedYear = parseInt(yearInput.value, 10);
		const currentMonth = new Date().getMonth() + 1;
		const currentYear = new Date().getFullYear();

		if (!selectedMonth) {
			month.textContent = "MM";
			return;
		}

		if (selectedYear === currentYear && selectedMonth < currentMonth) {
			alert("Nie możesz wybrać przeszłego miesiąca w bieżącym roku!");
			e.target.value = "";
			month.textContent = "MM";
			return;
		}

		month.classList.remove("rise-up");
		setTimeout(() => {
			month.textContent = selectedMonth.toString().padStart(2, "0");
			month.classList.add("rise-up");
		}, 10);
	};

	const updateCardYear = (e) => {
		const { year } = elements.card;
		const selectedYear = parseInt(e.target.value, 10) % 100;

		if (!selectedYear) {
			year.textContent = "YY";
			return;
		}

		year.classList.remove("rise-up");
		setTimeout(() => {
			year.textContent = selectedYear;
			year.classList.add("rise-up");
		}, 10);
	};

	const updateCardCVV = (e) => {
		const { cvv } = elements.card;
		const value = e.target.value.replace(/\D/g, "").slice(0, 3);
		e.target.value = value;
		cvv.textContent = value;
	};

	const initEventListeners = () => {
		const { number, holder, cvv, month, year } = elements.form;
		const { wrapper } = elements.card;

		// Obsługa numeru karty
		number.addEventListener("input", updateCardNumber);

		// Obsługa imienia i nazwiska
		holder.addEventListener("input", updateCardName);

		// Obsługa daty ważności
		month.addEventListener("change", updateCardMonth);
		year.addEventListener("change", updateCardYear);

		// Obsługa kodu CVV
		cvv.addEventListener("input", updateCardCVV);
		cvv.addEventListener("focus", () => {
			wrapper.classList.add("flipped");
		});
		cvv.addEventListener("blur", () => {
			wrapper.classList.remove("flipped");
		});
	};

	initEventListeners();
	initializeBorder(borderConfigs);
}
