function modalAddPhoto(modalContent, categories) {
    // empty content to refill
    modalContent.innerHTML = "";

    // Show back button
    const backButton = modalContent.parentElement.querySelector(".back-button");
    if (backButton) backButton.classList.remove("invisible");

    const {
        form,
        inputPhoto,
        previewForm,
        inputTitle,
        selectCategories,
        labelCategories
    } = createDomModalAddPhoto(modalContent)
    // //  Create modal title
    // const modalTitle = document.createElement("h2");
    // modalTitle.classList.add("modal-title");
    // modalTitle.textContent = "Ajout photo";
    // modalContent.appendChild(modalTitle);

    // // Create form
    // const form = document.createElement("form");
    // form.classList.add("modal-form");
    // modalContent.appendChild(form);

    // //Input photo + label

    // //Container
    // const inputContainer = document.createElement("div")
    // inputContainer.classList.add("input-container")
    // form.appendChild(inputContainer)

    // //Preview
    // const previewForm = document.createElement("img")
    // previewForm.id = "preview"
    // previewForm.alt = "Aperçu"
    // previewForm.src= "./assets/icons/previewIcon.png"

    // //create Input label 
    // const labelPhoto = document.createElement("label");
    // labelPhoto.htmlFor = "fileInput" // Lie l'input au label
    // labelPhoto.classList.add("upload-button")
    // labelPhoto.textContent = "+ Ajouter photo";

    // // Create input photo
    // const inputPhoto = document.createElement("input");
    // inputPhoto.type = "file";
    // inputPhoto.id = "fileInput";
    // inputPhoto.classList.add("input-photo");
    // inputPhoto.accept = "image/jpg, image/png"; 
    // // Create info text
    // const uploadInfo = document.createElement("p")
    // uploadInfo.classList.add("upload-info")
    // uploadInfo.textContent ="jpg, png : 4 mo max"

    // // Insertion in DOM
    // inputContainer.appendChild(previewForm);
    // inputContainer.appendChild(labelPhoto);
    // inputContainer.appendChild(inputPhoto);
    // inputContainer.appendChild(uploadInfo)

    // // Create Input titre + label
    // const inputTitle = document.createElement("input");
    // inputTitle.type = "text";
    // inputTitle.classList.add("input-title");

    // const labelTitle = document.createElement("label");
    // labelTitle.classList.add("label-title");
    // labelTitle.textContent = "Titre";
    // labelTitle.appendChild(inputTitle);
    // form.appendChild(labelTitle);

    // // Create Select catégories + label
    // const selectCategories = document.createElement("select");
    // selectCategories.classList.add("select-categories");

    // const labelCategories = document.createElement("label");
    // labelCategories.classList.add("label-categories")
    // labelCategories.textContent = "Catégorie";

    // //Select behavior
    // //Default select option
    // const defaultOption = document.createElement("option")
    // defaultOption.value = ""
    // defaultOption.textContent = "Veuillez sélectionner une catégorie"
    // defaultOption.selected = true;  
    // defaultOption.disabled = true;
    // selectCategories.appendChild(defaultOption)

    // //Select options
    // categories.forEach(category => {
    //     const option = document.createElement("option");
    //     option.classList.add("options");
    //     option.value = category.id // L'API attend l'id pas le name
    //     option.textContent = category.name;
    //     selectCategories.appendChild(option);
    // });

    // labelCategories.appendChild(selectCategories);
    // form.appendChild(labelCategories);

    // // Submit button
    // const modalButton = document.createElement("button");
    // modalButton.type = "submit"
    // modalButton.classList.add("modal-button","modal-button-alt");
    // modalButton.textContent = "Valider";
    // form.appendChild(modalButton)

    // // create Message error area
    // const messageError = document.createElement("p")
    // messageError.classList.add("message-error","invisible")
    // messageError.textcontent= ""
    // form.after(messageError)

    // Call for functions
    behaviorModalSelect(selectCategories,labelCategories,form,categories)
    previewUpload(previewForm,inputPhoto)
    submitAddPhoto(form,inputPhoto,inputTitle,previewForm,selectCategories,modalContent)
}
function behaviorModalSelect (selectCategories,labelCategories,form,categories) {
    //Select behavior
    //Default select option
    const defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.textContent = "Veuillez sélectionner une catégorie"
    defaultOption.selected = true;  
    defaultOption.disabled = true;
    selectCategories.appendChild(defaultOption)

    //Select options
    categories.forEach(category => {
        const option = document.createElement("option");
        option.classList.add("options");
        option.value = category.id // L'API attend l'id pas le name
        option.textContent = category.name;
        selectCategories.appendChild(option);
    });

    labelCategories.appendChild(selectCategories);
    form.appendChild(labelCategories);
}
function createDomModalAddPhoto () {
    //  Create modal title
    const modalTitle = document.createElement("h2");
    modalTitle.classList.add("modal-title");
    modalTitle.textContent = "Ajout photo";
    modalContent.appendChild(modalTitle);

    // Create form
    const form = document.createElement("form");
    form.classList.add("modal-form");
    modalContent.appendChild(form);

    //Input photo + label

    //Container
    const inputContainer = document.createElement("div")
    inputContainer.classList.add("input-container")
    form.appendChild(inputContainer)

    //Preview
    const previewForm = document.createElement("img")
    previewForm.id = "preview"
    previewForm.alt = "Aperçu"
    previewForm.src= "./assets/icons/previewIcon.png"

    //create Input label 
    const labelPhoto = document.createElement("label");
    labelPhoto.htmlFor = "fileInput" // Lie l'input au label
    labelPhoto.classList.add("upload-button")
    labelPhoto.textContent = "+ Ajouter photo";

    // Create input photo
    const inputPhoto = document.createElement("input");
    inputPhoto.type = "file";
    inputPhoto.id = "fileInput";
    inputPhoto.classList.add("input-photo");
    inputPhoto.accept = "image/jpg, image/png"; 
    // Create info text
    const uploadInfo = document.createElement("p")
    uploadInfo.classList.add("upload-info")
    uploadInfo.textContent ="jpg, png : 4 mo max"

    // Insertion in DOM
    inputContainer.appendChild(previewForm);
    inputContainer.appendChild(labelPhoto);
    inputContainer.appendChild(inputPhoto);
    inputContainer.appendChild(uploadInfo)

    // Create Input titre + label
    const inputTitle = document.createElement("input");
    inputTitle.type = "text";
    inputTitle.classList.add("input-title");

    const labelTitle = document.createElement("label");
    labelTitle.classList.add("label-title");
    labelTitle.textContent = "Titre";
    labelTitle.appendChild(inputTitle);
    form.appendChild(labelTitle);

    // Create Select catégories + label
    const selectCategories = document.createElement("select");
    selectCategories.classList.add("select-categories");

    const labelCategories = document.createElement("label");
    labelCategories.classList.add("label-categories")
    labelCategories.textContent = "Catégorie";

    // Submit button
    const modalButton = document.createElement("button");
    modalButton.type = "submit"
    modalButton.classList.add("modal-button","modal-button-alt");
    modalButton.textContent = "Valider";
    form.appendChild(modalButton)

    // create Message error area
    const messageError = document.createElement("p")
    messageError.classList.add("message-error","invisible")
    messageError.textContent= ""
    form.after(messageError)

    //Variable created
    return {
        form,
        inputPhoto,
        previewForm,
        inputTitle,
        selectCategories,
        labelCategories
    }
}