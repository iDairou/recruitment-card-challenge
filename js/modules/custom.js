export default function () {
	// NUMBER
	const formNumberInput = document.querySelector("#card-number");
	const cardNumberBlocks = document.querySelectorAll(
		".card__preview--number--block"
	);

	// NAME
	const formHolderInput = document.querySelector("#card-name");
	const cardHolderValue = document.querySelector(
		".card__previev--holder--name"
	);

	// EXPIRED
	const formMonthInput = document.querySelector("#expiration-month");
	const formYearInput = document.querySelector("#expiration-year");
	const cardMonthValue = document.querySelector(
		".card__previev--expires--box--month"
	);
	const cardYearValue = document.querySelector(
		".card__previev--expires--box--year"
	);

	// IMAGES
	const cardLogoImage = document.querySelector(".card__preview--logo img");

	// CVV
	const formCvvInput = document.querySelector("#cvv");

	// FRONT CARD
	const frontCard = document.querySelector(".card__preview");
	// BACK CARD
	const backCard = document.querySelector(".card__preview--backside");

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
		if (!cardLogoImage) return;
		const cardLogo = identifyLogoImage(number);
		cardLogoImage.src = `/images/${cardLogo}.png`;
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
		const digitSpans = document.querySelectorAll(".card__digit");
		digitSpans.forEach((span, index) => {
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

	const updateCardName = (e) => {
		const input = e.target;
		const value = input.value
			.toUpperCase()
			.replace(/[^A-Z\s]/g, "")
			.replace(/\s{2,}/g, " ")
			.slice(0, 26);

		input.value = value;
		cardHolderValue.textContent = value || "AD SOYAD";
		console.log(value);

		setTimeout(() => {
			cardHolderValue.classList.add("from-right-char");
		}, 10);
	};

	const updateCardMonth = (e) => {
		const currentMonth = new Date().getMonth() + 1;
		const selectedMonth = parseInt(e.target.value, 10);
		const selectedYear = parseInt(formYearInput.value, 10);
		const currentYear = new Date().getFullYear();

		if (!selectedMonth) {
			cardMonthValue.textContent = "MM";
			return;
		}
		if (selectedYear === currentYear && selectedMonth < currentMonth) {
			alert("Nie możesz wybrać przeszłego miesiąca w bieżącym roku!");
			e.target.value = "";
			cardMonthValue.textContent = "MM";
			return;
		}
		cardMonthValue.classList.remove("falling-character");

		// Małe opóźnienie, aby usunięcie klasy miało efekt i można było ją dodać ponownie - do przemyślenia (!)
		setTimeout(() => {
			cardMonthValue.textContent = selectedMonth.toString().padStart(2, "0");
			cardMonthValue.classList.add("falling-character");
		}, 10);
	};

	const updateCardYear = (e) => {
		const selectedYear = parseInt(e.target.value, 10) % 100;
		if (!selectedYear) {
			cardYearValue.textContent = "YY";
			return;
		}
		cardYearValue.classList.remove("falling-character");

		setTimeout(() => {
			cardYearValue.textContent = selectedYear;
			cardYearValue.classList.add("falling-character");
		}, 10);
	};

	// const updateCardCvv = (e) => {
	// 	frontCard.style.display = "none";
	// 	backCard.style.display = "block";
	// };

	// Nasłuchiwanie na zmianę wartości w polach formularza
	formMonthInput.addEventListener("change", updateCardMonth);
	formYearInput.addEventListener("change", updateCardYear);
	formNumberInput.addEventListener("input", updateCardNumber);
	formHolderInput.addEventListener("input", updateCardName);
	formCvvInput.addEventListener("focus", updateCardCvv);
}
