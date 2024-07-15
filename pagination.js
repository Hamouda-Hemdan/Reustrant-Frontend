function createPagination(currentPage, totalPages) {
  const element = document.querySelector(".pagination ul");
  let liTag = '';

  if (totalPages > 1) {
    if (currentPage > 1) {
      liTag += `<li class="btn prev" onclick="handlePagination(${currentPage - 1})"><span><i class="fas fa-angle-left"></i> Prev</span></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
      liTag += `<li class="numb ${currentPage === i ? 'active' : ''}" onclick="handlePagination(${i})"><span>${i}</span></li>`;
    }

    if (currentPage < totalPages) {
      liTag += `<li class="btn next" onclick="handlePagination(${currentPage + 1})"><span>Next <i class="fas fa-angle-right"></i></span></li>`;
    }
  }

  element.innerHTML = liTag;
}
