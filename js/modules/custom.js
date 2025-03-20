export default function () {
	const htmlElements = {
		inputFields: document.querySelectorAll(".card__form--input"),
		formNumberInput: document.querySelector("#card-number"),
		formHolderInput: document.querySelector("#card-name"),
		formCvvInput: document.querySelector("#cvv"),
		formMonthInput: document.querySelector("#expiration-month"),
		formYearInput: document.querySelector("#expiration-year"),
		cardHolderValue: document.querySelector(".card__preview--holder--char"),
		cardMonthValue: document.querySelector(
			".card__previev--expires--box--month"
		),
		cardYearValue: document.querySelector(".card__previev--expires--box--year"),
		cardLogoImage: document.querySelectorAll(".card__preview--logo img"),
		cardCvvField: document.querySelector(".card__preview--cvv-box"),
		cardWrapper: document.querySelector(".card__wrapper"),
		digitSpans: document.querySelectorAll(".card__digit"),
	};

	const setupCardSections = () => {
		const sections = {
			numberSection: document.querySelector(".card__preview--number"),
			holderSection: document.querySelector(".card__preview--holder"),
			expirySection: document.querySelector(".card__preview--expires"),
			cvvSection: document.querySelector(".card__preview--backside--cvv-container")
		};
		
		Object.values(sections).forEach(section => {
			if (section) {
				section.classList.add('card__section');
			}
		});
		
		return sections;
	};
	
	const cardSections = setupCardSections();

	const logoPatterns = {
		visa: /^4/,
		mastercard: /^5[1-5]|^2[2-7]/,
	};

	const identifyLogoImage = (number) => {
		const { visa, mastercard } = logoPatterns;
		if (visa.test(number)) {
			return "visa";
		} else if (mastercard.test(number)) {
			return "mastercard";
		} else {
			//default?
			return "visa";
		}
	};

	const handleLogoChange = (number) => {
		const imagesArr = Array.from(htmlElements.cardLogoImage);
		if (!htmlElements.cardLogoImage) return;
		const cardLogo = identifyLogoImage(number);

		imagesArr.forEach((image) => {
			const currentSrc = image.src;
			if (currentSrc !== `/images/${cardLogo}.png`) {

				image.classList.remove("falling-character");
				image.src = `/images/${cardLogo}.png`;
				void image.offsetWidth; // Wywołaj reflow?
				image.classList.add("falling-character");
			}
		});
	};

	const handleCvvChange = (e) => {
		const input = e.target;
		htmlElements.cardCvvField.textContent = input.value;
	};

	const updateCardNumber = (e) => {
		const input = e.target;
		const value = input.value.replace(/\D/g, "").slice(0, 16);
		input.value = value;
		handleLogoChange(value);
		updateCardPreview(value);
	};

	const updateCardPreview = (value) => {
		const digits = value.split("");
		htmlElements.digitSpans.forEach((span, index) => {
			const isRising = span.classList.contains("rising-character");

			if (!isRising) {
				span.classList.remove("falling-character");
			} else {
				span.classList.remove("rising-character");
			}

			if (index < digits.length) {
				span.textContent = digits[index];
				span.classList.add("falling-character");
			} else if (span.textContent !== "#") {
				span.textContent = "#";
				span.classList.add("rising-character");
				span.classList.remove("falling-character");
			}
		});
	};

	const clearCardHolder = () => {
		while (htmlElements.cardHolderValue.firstChild) {
			htmlElements.cardHolderValue.removeChild(
				htmlElements.cardHolderValue.firstChild
			);
		}
	};

	const addCharactersToCard = (text) => {
		let previousNameLength = 0;
		const isAdding = text.length > previousNameLength;
		previousNameLength = text.length;

		for (let i = 0; i < text.length; i++) {
			const charElement = document.createElement("span");
			charElement.classList.add("card__preview--holder--char");
			charElement.textContent = text[i];

			if (isAdding && i === text.length - 1) {
				charElement.classList.add("slide-from-right");
			}

			htmlElements.cardHolderValue.appendChild(charElement);
		}
	};

	const updateCardName = (e) => {
		const input = e.target;
		const maxLength = 20;
		if (input.value.length > maxLength) {
			input.value = input.value.slice(0, maxLength);
			return;
		}
		const value = input.value
			.toUpperCase()
			.replace(/[^A-Z\s]/g, "")
			.replace(/\s{2,}/g, " ");
		input.value = value;

		clearCardHolder();

		if (value.length === 0) {
			htmlElements.cardHolderValue.textContent = "AD SOYAD";
			return;
		}
		addCharactersToCard(value);
	};

	const updateCardMonth = (e) => {
		const currentMonth = new Date().getMonth() + 1;
		const selectedMonth = parseInt(e.target.value, 10);
		const selectedYear = parseInt(htmlElements.formYearInput.value, 10);
		const currentYear = new Date().getFullYear();

		if (!selectedMonth) {
			htmlElements.cardMonthValue.textContent = "MM";
			return;
		}
		if (selectedYear === currentYear && selectedMonth < currentMonth) {
			alert("Nie możesz wybrać przeszłego miesiąca w bieżącym roku!");
			e.target.value = "";
			htmlElements.cardMonthValue.textContent = "MM";
			return;
		}
		htmlElements.cardMonthValue.classList.remove("falling-character");

		// Małe opóźnienie, aby usunięcie klasy miało efekt i można było ją dodać ponownie - do przemyślenia (!)
		setTimeout(() => {
			htmlElements.cardMonthValue.textContent = selectedMonth
				.toString()
				.padStart(2, "0");
			htmlElements.cardMonthValue.classList.add("falling-character");
		}, 10);
	};

	const updateCardYear = (e) => {
		const selectedYear = parseInt(e.target.value, 10) % 100;
		if (!selectedYear) {
			htmlElements.cardYearValue.textContent = "YY";
			return;
		}
		htmlElements.cardYearValue.classList.remove("falling-character");

		setTimeout(() => {
			htmlElements.cardYearValue.textContent = selectedYear;
			htmlElements.cardYearValue.classList.add("falling-character");
		}, 10);
	};
	
	const clearFocusFromAllSections = () => {
		Object.values(cardSections).forEach(section => {
			if (section) {
				section.classList.remove('card__section--focus');
			}
		});
	};
	

	const handleInputFocus = (e) => {
		clearFocusFromAllSections();
		
		const inputId = e.target.id;
		
		switch(inputId) {
			case 'card-number':
				cardSections.numberSection.classList.add('card__section--focus');
				break;
			case 'card-name':
				cardSections.holderSection.classList.add('card__section--focus');
				break;
			case 'expiration-month':
			case 'expiration-year':
				cardSections.expirySection.classList.add('card__section--focus');
				break;
			case 'cvv':
				cardSections.cvvSection.classList.add('card__section--focus');
				break;
		}
	};

	const addEventListeners = () => {
		const {
			formCvvInput,
			cardWrapper,
			formMonthInput,
			formYearInput,
			formNumberInput,
			formHolderInput,
		} = htmlElements;

		formCvvInput.addEventListener("focus", () => {
			cardWrapper.classList.add("flipped");
			handleInputFocus({ target: formCvvInput });
		});

		formCvvInput.addEventListener("blur", () => {
			cardWrapper.classList.remove("flipped");
			clearFocusFromAllSections();
		});

		formMonthInput.addEventListener("change", updateCardMonth);
		formYearInput.addEventListener("change", updateCardYear);
		formNumberInput.addEventListener("input", updateCardNumber);
		formHolderInput.addEventListener("input", updateCardName);
		formCvvInput.addEventListener("input", handleCvvChange);
		
		formNumberInput.addEventListener("focus", handleInputFocus);
		formHolderInput.addEventListener("focus", handleInputFocus);
		formMonthInput.addEventListener("focus", handleInputFocus);
		formYearInput.addEventListener("focus", handleInputFocus);
		
		const allInputs = [formNumberInput, formHolderInput, formMonthInput, formYearInput, formCvvInput];
		allInputs.forEach(input => {
			input.addEventListener("blur", (e) => {
				setTimeout(() => {
					const activeElement = document.activeElement;
					if (!allInputs.includes(activeElement)) {
						clearFocusFromAllSections();
					}
				}, 50);
			});
		});
	};
	
	addEventListeners();
}