$(document).ready(function() {
    $('.cd-faq__content').hide(); // Hide content initially
    
    // Add click event listener to toggle content visibility
    $('.cd-faq__item').on('click', function(event){
      event.preventDefault();
      var selectedItem = $(this);
      
      // Toggle visibility of content
      selectedItem.find('.cd-faq__content').slideToggle(200);
      
      // Change chevron icon
      selectedItem.toggleClass('content-visible');

      // Toggle rotation of chevron icon based on visibility class
      var isVisible = selectedItem.hasClass('content-visible');

      if (isVisible) {
          selectedItem.addClass('cd-faq__item-visible');
      } else {
        selectedItem.removeClass('cd-faq__item-visible');
      }
    });

    // Add click event listener to toggle category active state and scroll to anchor
    $('.cd-faq__category').on('click', function(event){
      event.preventDefault();
      var selectedCategory = $(this);
      
      // Remove active class from all categories
      $('.cd-faq__category').removeClass('cd-faq__category-selected');
      
      // Add active class to the clicked category
      selectedCategory.addClass('cd-faq__category-selected');
      
      // Scroll to the anchor position
      var targetAnchor = selectedCategory.attr('href');
      var targetSection = $(targetAnchor);
      var titleOffset = targetSection.find('.cd-faq__title').offset().top - 120; // Adjusted offset
      $('html, body').animate({
        scrollTop: titleOffset
      }, 500);
    });
  
    // Close panel when close button is clicked
    $('.cd-faq__close-panel').on('click', function(event){
      event.preventDefault();
      $('.cd-faq').removeClass('is-visible');
    });
});
