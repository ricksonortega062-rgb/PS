/*
 * ============================================================
 *  ParkSmart — script.js
 *  FULLY FUNCTIONAL jQuery Script
 *
 *  WHAT IS jQuery?
 *  jQuery is a JavaScript library that makes it easier to:
 *  - Select HTML elements  →  $('selector')
 *  - Change content/style →  .text(), .css(), .addClass()
 *  - Listen for events    →  .on('click', ...), .on('submit', ...)
 *  - Animate elements     →  .fadeIn(), .fadeOut(), .slideDown()
 *  - Build & insert HTML  →  .append(), .prepend(), .html()
 *
 *  The dollar sign $ is just shorthand for jQuery()
 *  Example:  jQuery('#myBtn')  ===  $('#myBtn')
 * ============================================================
 */


/* ============================================================
   $(document).ready(...)
   ------------------------------------------------------------
   JQUERY EXPLANATION:
   This is the STARTING POINT of all jQuery code.
   It means: "Wait until the full HTML page has loaded,
   THEN run this function."
   Without this, jQuery might try to find elements that
   don't exist yet in the DOM (page structure).
   ============================================================ */
$(document).ready(function () {


  /* ============================================================
     SECTION 1 — NAVIGATION (Page Switching)
     ------------------------------------------------------------
     WHAT IT DOES:
     When you click a nav button, it hides all pages and
     shows only the one you clicked.

     JQUERY USED:
     $(document).on('click', selector, fn)
       → "Event Delegation" — listens for clicks on ANY element
         matching the selector, even ones added AFTER page load.
         Better than $('selector').on('click') because that only
         works on elements that EXIST at the time of the code.

     $(this)
       → Refers to the SPECIFIC element that was clicked.
         Like saying "this one right here".

     .data('page')
       → Reads the HTML attribute data-page="dashboard"
         from the element.  e.g. <button data-page="dashboard">

     .removeClass('active') / .addClass('active')
       → Removes or adds a CSS class to change styling.
         Removing 'active' from ALL nav links = unselects all.
         Adding 'active' to $(this) = highlights the clicked one.

     $('.module-page')
       → Selects ALL elements with class "module-page" at once.

     $('#page-' + target)
       → Selects element by ID, e.g. #page-dashboard
   ============================================================ */
  $(document).on('click', '.nav-link[data-page]', function () {
    var target = $(this).data('page'); // Get the data-page value e.g. "dashboard"

    // Remove 'active' class from ALL nav links (unselect all)
    $('.nav-link').removeClass('active');
    // Add 'active' class to the clicked nav link (select it)
    $(this).addClass('active');

    // Hide ALL pages by removing 'active' class
    $('.module-page').removeClass('active');
    // Show ONLY the target page by adding 'active' class
    $('#page-' + target).addClass('active');

    // Animate chart bars if switching to dashboard or analysis
    if (target === 'dashboard' || target === 'analysis') {
      setTimeout(animateBars, 200);
    }
  });


  /* ============================================================
     SECTION 2 — MODALS (Popup Windows)
     ------------------------------------------------------------
     WHAT IT DOES:
     Opens/closes popup modal windows.

     JQUERY USED:
     [data-modal]  → CSS attribute selector. Matches any element
       that HAS a data-modal attribute, e.g.:
       <button data-modal="new-reservation">

     .closest('.modal-overlay')
       → Traverses UP the DOM tree to find the nearest parent
         element with class "modal-overlay".
         Like saying "find my ancestor that is a modal wrapper".

     .addClass('open') / .removeClass('open')
       → Toggles the 'open' CSS class which shows/hides the modal
         via opacity and pointer-events in style.css.

     $(e.target)
       → The exact element the user clicked inside the event.
         We check if it's the dark overlay background itself
         (not the modal box) before closing.
   ============================================================ */

  // Open modal when any element with data-modal is clicked
  $(document).on('click', '[data-modal]', function () {
    var modalId = $(this).data('modal'); // e.g. "new-reservation"
    $('#modal-' + modalId).addClass('open'); // Shows #modal-new-reservation
  });

  // Close modal when clicking the dark BACKGROUND overlay
  $(document).on('click', '.modal-overlay', function (e) {
    // Only close if they clicked the overlay itself, not the modal box inside
    if ($(e.target).hasClass('modal-overlay')) {
      $(this).removeClass('open');
    }
  });

  // Close modal when clicking any element with class "modal-close"
  $(document).on('click', '.modal-close', function () {
    $(this).closest('.modal-overlay').removeClass('open'); // Find parent modal and close it
  });

  // Close modal with Escape key
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') {
      $('.modal-overlay.open').removeClass('open');
    }
  });


  /* ============================================================
     SECTION 3 — TOAST NOTIFICATIONS (Pop-up Messages)
     ------------------------------------------------------------
     WHAT IT DOES:
     Shows a small popup notification message at the
     bottom-right corner of the screen, then auto-hides it.

     JQUERY USED:
     $('<div>...</div>')
       → Creates a brand-new HTML element IN MEMORY
         (not yet visible on page).

     .append($t)
       → Inserts the new element INSIDE .toast-container
         at the END. Like pushing to a list.

     setTimeout(fn, 3000)
       → Vanilla JS timer — runs fn after 3 seconds.

     $t.fadeOut(300, callback)
       → jQuery ANIMATION: gradually makes element invisible
         over 300 milliseconds, then runs the callback.

     $(this).remove()
       → Permanently DELETES the element from the page/DOM.
   ============================================================ */
  window.showToast = function (msg, type) {
    type = type || 'info'; // Default to 'info' if no type given
    var icons = { success: '✅', warning: '⚠️', danger: '❌', info: 'ℹ️' };

    // Build the toast HTML element in memory
    var $t = $('<div class="toast ' + type + '">' +
      '<span style="font-size:16px;">' + (icons[type] || icons.info) + '</span>' +
      '<span class="toast-msg">' + msg + '</span>' +
      '<button class="toast-x" onclick="$(this).parent().remove()">✕</button>' +
      '</div>');

    // Insert toast into the toast container on the page
    $('.toast-container').append($t);

    // After 3.5 seconds, fade out and then remove from DOM
    setTimeout(function () {
      $t.fadeOut(350, function () {
        $(this).remove(); // $(this) here = $t (the toast element)
      });
    }, 3500);
  };


  /* ============================================================
     SECTION 4 — AUTH (Login / Sign Up)
     ------------------------------------------------------------
     WHAT IT DOES:
     Handles login form submission, signup, and switching
     between login and signup views.

     JQUERY USED:
     $('#login-form').on('submit', fn)
       → Listens for the form's submit event (when user
         presses Enter or clicks the submit button).

     e.preventDefault()
       → Stops the browser's DEFAULT behavior of reloading
         the page when a form is submitted.
         Without this, page would reload and all JS is lost.

     .val()
       → Gets the CURRENT VALUE typed inside an <input>.
         e.g. $('#login-email').val() → "user@email.com"

     .css('display', 'none') / .show()
       → Directly sets/removes CSS display property.
         .show() = display:block (visible)
         .hide() = display:none  (hidden)

     .addClass('hidden') / .removeClass('hidden')
       → Toggles our custom CSS class that sets display:none.
   ============================================================ */

  // Switch between Login and Signup forms
  window.showAuth = function (page) {
    // Hide both forms first
    $('#auth-login, #auth-signup').addClass('hidden');
    // Show only the requested form
    $('#auth-' + page).removeClass('hidden');
  };

  // Fill in demo credentials with one click
  $('#demo-btn').on('click', function () {
    // .val('text') SETS the value of an input field
    $('#login-email').val('admin@parksmart.ph');
    $('#login-pass').val('password123');
    showToast('Demo credentials filled! Click Sign In.', 'info');
  });

  // LOGIN FORM SUBMIT
  $('#login-form').on('submit', function (e) {
    e.preventDefault(); // Stop page from reloading

    var email = $('#login-email').val().trim();
    var pass  = $('#login-pass').val().trim();

    // Validate — check if fields are empty
    if (!email || !pass) {
      showToast('Please fill in all fields.', 'danger');
      return; // Stop here, don't continue
    }

    // Show loading state on button
    var $btn = $(this).find('button[type=submit]');
    $btn.text('Signing in...').prop('disabled', true);

    // Simulate a short delay (like an API call)
    setTimeout(function () {
      $btn.text('Sign In →').prop('disabled', false);
      showToast('Welcome back, Rickson! 🚗', 'success');

      // After 600ms, hide auth page and show main app
      setTimeout(function () {
        $('#page-auth').removeClass('active').hide(); // Hide auth
        $('.page-wrapper').fadeIn(400);               // Fade in app
        $('#page-dashboard').addClass('active');      // Show dashboard
        // Set Dashboard nav link as active
        $('.nav-link[data-page="dashboard"]').addClass('active');
        setTimeout(animateBars, 500); // Animate dashboard charts
      }, 600);
    }, 900);
  });

  // SIGNUP FORM SUBMIT
  $('#signup-form').on('submit', function (e) {
    e.preventDefault();
    var $btn = $(this).find('button[type=submit]');
    $btn.text('Creating...').prop('disabled', true);
    setTimeout(function () {
      $btn.text('Create Account →').prop('disabled', false);
      showToast('Account created! Please sign in.', 'success');
      showAuth('login'); // Switch back to login form
      $('#signup-form')[0].reset(); // Clear all fields using native reset
    }, 800);
  });

  // SIGN OUT
  $(document).on('click', '#signout-btn', function () {
    $('.page-wrapper').fadeOut(300, function () {
      $('#page-auth').addClass('active').show();
      showAuth('login');
      $('#login-form')[0].reset();
    });
    showToast('Signed out successfully.', 'info');
  });


  /* ============================================================
     SECTION 5 — PARKING LOTS (CRUD: Create, Read, Update, Delete)
     ------------------------------------------------------------
     WHAT IT DOES:
     - Search/filter lot list in real time
     - Add new lot to the list
     - Edit existing lot (populate modal with current values)
     - Delete a lot with confirmation
     - Open/Close lot toggle

     JQUERY USED:
     .on('keyup', fn)
       → Fires every time a key is RELEASED inside an input.
         Perfect for real-time search as user types.

     .text().toLowerCase().includes(q)
       → .text() gets all visible text content of an element.
         toLowerCase() normalizes case for comparison.
         includes(q) checks if search term is found.

     .toggle(bool)
       → Shows element if bool=true, hides if bool=false.
         One-liner for show/hide based on condition.

     .find('.lot-name').text()
       → .find() searches INSIDE an element for a child.
         Finds the .lot-name element inside the clicked lot row.

     .prepend() vs .append()
       → .prepend() adds as FIRST child (top of list)
       → .append() adds as LAST child (bottom of list)

     .closest('.lot-item').remove()
       → .closest() finds the nearest parent matching selector.
         .remove() deletes it and all its children from the DOM.
   ============================================================ */

  // REAL-TIME SEARCH — fires on every keypress
  $('#lots-search').on('keyup', function () {
    var q = $(this).val().toLowerCase(); // Get search term, make lowercase
    $('.lot-item').each(function () {
      // .each() loops through ALL .lot-item elements one by one
      // $(this) inside .each() = the current lot-item in the loop
      var text = $(this).text().toLowerCase();
      $(this).toggle(text.includes(q)); // Show if matches, hide if not
    });
  });

  // ADD NEW LOT FORM
  $('#add-lot-form').on('submit', function (e) {
    e.preventDefault();

    var name    = $('#new-lot-name').val().trim();
    var address = $('#new-lot-address').val().trim();
    var slots   = $('#new-lot-slots').val();
    var rate    = $('#new-lot-rate').val();
    var status  = $('#new-lot-status').val();

    if (!name || !address || !slots || !rate) {
      showToast('Please fill all required fields.', 'warning');
      return;
    }

    var lotId   = 'LOT-' + String($('.lot-item').length + 1).padStart(5, '0');
    var badgeClass = status === 'Open' ? 'badge-success' : status === 'Closed' ? 'badge-danger' : 'badge-warning';

    // Build the new lot HTML element using jQuery's $() constructor
    var $newLot = $(
      '<div class="lot-item" data-id="' + lotId + '">' +
        '<div class="lot-avatar">🚗</div>' +
        '<div class="lot-info">' +
          '<div class="lot-name">Parking ' + name + '</div>' +
          '<div class="lot-detail">📍 ' + address + '<br>🚘 0/' + slots + ' occupied · ₱' + rate + '/hr</div>' +
        '</div>' +
        '<div style="margin-right:12px;"><span class="badge ' + badgeClass + '">' + status + '</span></div>' +
        '<div class="lot-actions">' +
          '<button class="btn btn-outline btn-sm edit-lot-btn">Edit</button>' +
          '<button class="btn btn-primary btn-sm" data-modal="add-hours">Add Hours</button>' +
          '<button class="btn btn-danger btn-sm delete-lot-btn">Delete</button>' +
        '</div>' +
      '</div>'
    );

    // .prepend() inserts the new lot at the TOP of the list
    $('#lots-list').prepend($newLot);

    // Close the modal and reset the form
    $('#modal-add-lot').removeClass('open');
    $(this)[0].reset(); // native JS reset to clear all inputs

    showToast('Parking lot "' + name + '" added! ✅', 'success');
    updateLotCount(); // Update the count badge
  });

  // EDIT LOT — populate modal with current lot data
  $(document).on('click', '.edit-lot-btn', function () {
    // .closest() climbs UP the DOM to find the parent .lot-item
    var $lot    = $(this).closest('.lot-item');
    // .find() goes DOWN the DOM to find children
    var lotName = $lot.find('.lot-name').text();
    var detail  = $lot.find('.lot-detail').text();

    // .val('value') SETS the input's value
    $('#edit-lot-name').val(lotName);
    $('#edit-lot-address').val(detail.split('📍 ')[1] ? detail.split('📍 ')[1].split('\n')[0].trim() : '');

    // Store reference to which lot we're editing (using jQuery .data())
    $('#modal-edit-lot').data('target-lot', $lot);
    $('#modal-edit-lot').addClass('open');
  });

  // SAVE EDITED LOT
  $('#edit-lot-form').on('submit', function (e) {
    e.preventDefault();
    var newName    = $('#edit-lot-name').val().trim();
    var newAddress = $('#edit-lot-address').val().trim();
    var newSlots   = $('#edit-lot-slots').val();
    var newRate    = $('#edit-lot-rate').val();

    if (!newName) { showToast('Lot name is required.', 'warning'); return; }

    // Retrieve the stored reference to the target lot
    var $target = $('#modal-edit-lot').data('target-lot');
    if ($target) {
      // Update the lot item's text in place
      $target.find('.lot-name').text('Parking ' + newName);
      if (newAddress) $target.find('.lot-detail').html('📍 ' + newAddress + '<br>🚘 Slots: ' + (newSlots || '—') + ' · ₱' + (newRate || '—') + '/hr');
    }

    $('#modal-edit-lot').removeClass('open');
    showToast('Lot updated successfully! ✅', 'success');
  });

  // DELETE LOT with confirmation
  $(document).on('click', '.delete-lot-btn', function () {
    var $lot  = $(this).closest('.lot-item');
    var name  = $lot.find('.lot-name').text();
    var confirmed = confirm('Are you sure you want to delete "' + name + '"?');
    if (confirmed) {
      // .fadeOut() animates the element to invisible, then removes it
      $lot.fadeOut(300, function () {
        $(this).remove(); // Remove from DOM after fade completes
        updateLotCount();
        showToast('"' + name + '" deleted.', 'warning');
      });
    }
  });

  // TOGGLE LOT STATUS (Open/Close)
  $(document).on('click', '.toggle-lot-btn', function () {
    var $lot    = $(this).closest('.lot-item');
    var $badge  = $lot.find('.lot-status-badge');
    var current = $badge.text().trim();

    if (current === 'Open') {
      $badge.text('Closed').removeClass('badge-success').addClass('badge-danger');
      $(this).text('Open').removeClass('btn-secondary').addClass('btn-success');
      showToast('Lot closed.', 'warning');
    } else {
      $badge.text('Open').removeClass('badge-danger').addClass('badge-success');
      $(this).text('Close').removeClass('btn-success').addClass('btn-secondary');
      showToast('Lot opened! ✅', 'success');
    }
  });

  function updateLotCount() {
    // Count visible lot items and update the badge
    var count = $('.lot-item:visible').length;
    $('#lot-count-badge').text(count + ' Active');
  }


  /* ============================================================
     SECTION 6 — PARKING LOGS (Table Search + Filter)
     ------------------------------------------------------------
     WHAT IT DOES:
     - Real-time search across the logs table
     - Filter by lot and date
     - Add new log entry manually

     JQUERY USED:
     .on('keyup') and .on('change')
       → 'keyup' fires as user types in text input
       → 'change' fires when a dropdown selection changes

     $('#logs-table tbody tr').each(fn)
       → Loops through every table row in the tbody.
         Perfect for filtering rows.

     .hide() and .show()
       → jQuery shorthand for display:none and display:block.
   ============================================================ */

  // Real-time search across all log table rows
  $('#logs-search').on('keyup', function () {
    var q = $(this).val().toLowerCase();
    filterLogs();
  });

  // Filter by lot dropdown
  $('#logs-filter-lot').on('change', function () {
    filterLogs();
  });

  // Filter by date
  $('#logs-filter-date').on('change', function () {
    filterLogs();
  });

  function filterLogs() {
    var q    = $('#logs-search').val().toLowerCase();
    var lot  = $('#logs-filter-lot').val();
    var date = $('#logs-filter-date').val();

    // Loop through every row in the logs table
    $('#logs-table tbody tr').each(function () {
      var rowText = $(this).text().toLowerCase();
      var rowLot  = $(this).find('td').eq(2).text().trim(); // Column index 2 = Lot
      var rowDate = $(this).data('date') || '';

      var matchSearch = !q    || rowText.includes(q);
      var matchLot    = !lot  || rowLot === lot;
      var matchDate   = !date || rowDate === date;

      // Show row only if ALL filters match
      $(this).toggle(matchSearch && matchLot && matchDate);
    });
  }

  // ADD NEW LOG ENTRY
  $('#add-log-form').on('submit', function (e) {
    e.preventDefault();
    var plate = $('#log-plate').val().trim().toUpperCase();
    var lot   = $('#log-lot').val();
    var slot  = $('#log-slot').val().trim();
    var timein = $('#log-timein').val();

    if (!plate || !lot || !slot || !timein) {
      showToast('Fill all required fields.', 'warning');
      return;
    }

    var logId = '#LOG-' + String($('#logs-table tbody tr').length + 1).padStart(4, '0');
    var now   = new Date().toLocaleDateString('en-PH');

    // Build and prepend new table row
    var $row = $('<tr data-date="' + now + '">' +
      '<td><strong>' + logId + '</strong></td>' +
      '<td>' + plate + '</td>' +
      '<td>' + lot + '</td>' +
      '<td>' + slot + '</td>' +
      '<td>' + timein + '</td>' +
      '<td>—</td>' +
      '<td>Active</td>' +
      '<td>—</td>' +
      '<td><span class="badge badge-success">Parked</span></td>' +
      '</tr>');

    // .prepend() adds the new row at the TOP of tbody
    $('#logs-table tbody').prepend($row);
    $('#modal-add-log').removeClass('open');
    $(this)[0].reset();
    showToast(plate + ' logged in! ✅', 'success');
  });


  /* ============================================================
     SECTION 7 — RESERVATIONS (Add + Edit + Cancel + Restore)
     ------------------------------------------------------------
     WHAT IT DOES:
     - Create new reservation and add to list
     - Edit reservation details
     - Cancel/restore reservations
     - Search through reservations

     JQUERY USED:
     .prepend($element)
       → Inserts element as FIRST child inside the target.

     .on('click', selector, fn) — Event Delegation
       → Critical here because reservation items are added
         DYNAMICALLY. We can't bind events to elements that
         don't exist yet at page load.
         By listening on $(document) or a parent, it works
         for ALL matching elements — past, present, and future.
   ============================================================ */

  // SEARCH RESERVATIONS
  $('#res-search').on('keyup', function () {
    var q = $(this).val().toLowerCase();
    $('.res-item').each(function () {
      $(this).toggle($(this).text().toLowerCase().includes(q));
    });
  });

  // FILTER BY STATUS
  $('#res-filter-status').on('change', function () {
    var status = $(this).val();
    $('.res-item').each(function () {
      if (!status) { $(this).show(); return; }
      var badge = $(this).find('.badge').text().trim().toLowerCase();
      $(this).toggle(badge === status.toLowerCase());
    });
  });

  // CREATE NEW RESERVATION
  $('#reservation-form').on('submit', function (e) {
    e.preventDefault();

    var plate = $('#res-plate').val().trim().toUpperCase();
    var lot   = $('#res-lot').val();
    var slot  = $('#res-slot').val();
    var date  = $('#res-date').val();
    var time  = $('#res-time').val();
    var notes = $('#res-notes').val();

    if (!lot || !date || !slot) {
      showToast('Please fill all required fields (*).', 'warning');
      return;
    }

    var id = '#RES-' + (Math.floor(Math.random() * 9000) + 1000);

    // Build new reservation item HTML using jQuery constructor $()
    var $newRes = $(
      '<div class="res-item" data-status="pending">' +
        '<div class="res-info">' +
          '<div class="res-id">' + id + (plate ? ' — ' + plate : '') + '</div>' +
          '<div class="res-detail">' + lot + ' · Slot ' + slot +
            ' · ' + date + (time ? ' ' + time : '') +
            (notes ? ' · <em>' + notes + '</em>' : '') +
          '</div>' +
        '</div>' +
        '<div class="res-actions">' +
          '<button class="btn btn-outline btn-sm res-edit-btn">Edit</button>' +
          '<button class="btn btn-danger btn-sm res-cancel-btn">Cancel</button>' +
        '</div>' +
        '<span class="badge badge-warning">Pending</span>' +
      '</div>'
    );

    // .prepend() = add to TOP of list so it appears first
    $('#res-list').prepend($newRes);
    showToast(id + ' created! ✅', 'success');
    $('#modal-new-reservation').removeClass('open');
    $(this)[0].reset(); // Clear the form
  });

  // CANCEL RESERVATION — Event Delegation (works for dynamic elements)
  $(document).on('click', '.res-cancel-btn', function () {
    var $item = $(this).closest('.res-item');
    var id    = $item.find('.res-id').text();

    // Find the badge inside this reservation item and update it
    $item.find('.badge')
      .text('Cancelled')
      .removeClass('badge-success badge-warning badge-info')
      .addClass('badge-danger');

    // Replace Cancel button with Restore button
    $(this).replaceWith('<button class="btn btn-success btn-sm res-restore-btn">Restore</button>');
    $item.data('status', 'cancelled');
    showToast(id + ' cancelled.', 'warning');
  });

  // RESTORE RESERVATION — Event Delegation
  $(document).on('click', '.res-restore-btn', function () {
    var $item = $(this).closest('.res-item');
    var id    = $item.find('.res-id').text();

    $item.find('.badge')
      .text('Pending')
      .removeClass('badge-danger badge-success badge-info')
      .addClass('badge-warning');

    $(this).replaceWith('<button class="btn btn-outline btn-sm res-edit-btn">Edit</button><button class="btn btn-danger btn-sm res-cancel-btn">Cancel</button>');
    $item.data('status', 'pending');
    showToast(id + ' restored! ✅', 'success');
  });

  // CONFIRM RESERVATION
  $(document).on('click', '.res-confirm-btn', function () {
    var $item = $(this).closest('.res-item');
    $item.find('.badge')
      .text('Confirmed')
      .removeClass('badge-warning badge-danger')
      .addClass('badge-success');
    $(this).remove();
    showToast('Reservation confirmed! ✅', 'success');
  });

  // EDIT RESERVATION — populate modal
  $(document).on('click', '.res-edit-btn', function () {
    var $item = $(this).closest('.res-item');
    $('#edit-res-id').text($item.find('.res-id').text());
    $('#modal-edit-reservation').data('target', $item).addClass('open');
  });

  // SAVE EDIT RESERVATION
  $('#edit-res-form').on('submit', function (e) {
    e.preventDefault();
    var $target = $('#modal-edit-reservation').data('target');
    if ($target) {
      var lot  = $('#edit-res-lot').val();
      var slot = $('#edit-res-slot').val();
      var date = $('#edit-res-date').val();
      var time = $('#edit-res-time').val();
      // Update the detail line of the target reservation
      $target.find('.res-detail').text(lot + ' · Slot ' + slot + ' · ' + date + ' ' + time);
    }
    $('#modal-edit-reservation').removeClass('open');
    showToast('Reservation updated! ✅', 'success');
  });


  /* ============================================================
     SECTION 8 — QR SCANNER (Scan Simulation + Check In/Out)
     ------------------------------------------------------------
     WHAT IT DOES:
     - Simulates QR code scanning with a 2-second delay
     - Randomly picks a plate number
     - Shows scan result with Check In / Check Out actions
     - Adds scan to history table

     JQUERY USED:
     .text('new text')
       → Changes the visible text content of an element.

     .prop('disabled', true/false)
       → Sets or removes the 'disabled' property on a button.
         Makes the button un-clickable while scanning.

     .removeClass('hidden')
       → Shows the hidden result panel by removing 'hidden' class.

     .prepend($row)
       → Adds scan history row to the TOP of the history table.
   ============================================================ */

  var lastScannedPlate = '';

  $('#scan-btn').on('click', function () {
    var $btn = $(this); // Save reference to button

    // Disable button and change text while "scanning"
    $btn.text('Scanning...').prop('disabled', true).addClass('btn-secondary').removeClass('btn-primary');

    var plates = ['ABC 1234', 'XYZ 5678', 'DEF 9012', 'GHI 3456', 'JKL 7890', 'MNO 1357', 'PQR 2468', 'STU 3579'];
    var lots   = ['Lot A', 'Lot B', 'Lot C', 'Lot D'];
    var slots  = ['A-01','A-05','A-09','B-03','B-12','C-07','D-02'];

    lastScannedPlate = plates[Math.floor(Math.random() * plates.length)];
    var randomLot    = lots[Math.floor(Math.random() * lots.length)];
    var randomSlot   = slots[Math.floor(Math.random() * slots.length)];
    var timeNow      = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });

    setTimeout(function () {
      // Re-enable button
      $btn.text('📷 Scan QR Code').prop('disabled', false).addClass('btn-primary').removeClass('btn-secondary');

      // Show the result panel
      $('#scan-result').removeClass('hidden');

      // Update result fields using .text()
      $('#scanned-plate').text(lastScannedPlate);
      $('#scanned-lot').text(randomLot);
      $('#scanned-slot').text(randomSlot);
      $('#scanned-time').text(timeNow);

      showToast('Plate ' + lastScannedPlate + ' scanned! ✅', 'success');
    }, 1800);
  });

  // CHECK IN — add to history
  $(document).on('click', '#checkin-btn', function () {
    if (!lastScannedPlate) { showToast('Scan a plate first!', 'warning'); return; }
    addScanHistory(lastScannedPlate, 'Check In', $('#scanned-lot').text());
    showToast(lastScannedPlate + ' checked in! 🚗', 'success');
    $('#scan-result').addClass('hidden');
    lastScannedPlate = '';
  });

  // CHECK OUT — add to history
  $(document).on('click', '#checkout-btn', function () {
    if (!lastScannedPlate) { showToast('Scan a plate first!', 'warning'); return; }
    addScanHistory(lastScannedPlate, 'Check Out', $('#scanned-lot').text());
    showToast(lastScannedPlate + ' checked out! 👋', 'info');
    $('#scan-result').addClass('hidden');
    lastScannedPlate = '';
  });

  function addScanHistory(plate, action, lot) {
    var timeNow   = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });
    var badgeClass = action === 'Check In' ? 'badge-success' : 'badge-muted';

    // Build new table row
    var $row = $('<tr>' +
      '<td>' + timeNow + '</td>' +
      '<td><strong>' + plate + '</strong></td>' +
      '<td><span class="badge ' + badgeClass + '">' + action + '</span></td>' +
      '<td>' + lot + '</td>' +
      '</tr>');

    // Prepend to scan history table (newest at top)
    $('#scan-history-table tbody').prepend($row);
  }


  /* ============================================================
     SECTION 9 — CALENDAR (Dynamic Date Rendering)
     ------------------------------------------------------------
     WHAT IT DOES:
     - Renders a calendar grid for the current month
     - Highlights today's date
     - Shows dots on days that have reservations
     - Navigate previous/next months

     JQUERY USED:
     $('#calendar-grid').html(html)
       → .html() REPLACES all inner content of the element.
         Used to rebuild the entire calendar when navigating.
         Different from .text() — .html() parses HTML tags.

     .on('click', '#cal-prev', fn)
       → Listens for click on the Previous button.
   ============================================================ */

  var calYear, calMonth;

  function initCal() {
    var now = new Date();
    calYear  = now.getFullYear();
    calMonth = now.getMonth();
    renderCal();
  }

  function renderCal() {
    var monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December'];

    // Update the calendar title using .text()
    $('#cal-title').text(monthNames[calMonth] + ' ' + calYear);

    var firstDay     = new Date(calYear, calMonth, 1).getDay();    // 0=Sun
    var daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate();
    var today        = new Date();
    var reservedDays = [3, 7, 12, 15, 19, 22, 25, 28]; // Mock reserved days

    var html = '';

    // Day headers
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function (d) {
      html += '<div class="cal-head">' + d + '</div>';
    });

    // Empty cells before the 1st
    for (var i = 0; i < firstDay; i++) {
      var prevDate = new Date(calYear, calMonth, -firstDay + i + 1).getDate();
      html += '<div class="cal-day other-month">' + prevDate + '</div>';
    }

    // Days of month
    for (var d = 1; d <= daysInMonth; d++) {
      var isToday  = d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
      var hasEvent = reservedDays.indexOf(d) > -1;
      var classes  = 'cal-day' + (isToday ? ' today' : '') + (hasEvent ? ' has-event' : '');
      html += '<div class="' + classes + '" data-day="' + d + '">' + d + '</div>';
    }

    // Fill remaining cells
    var rem = 42 - firstDay - daysInMonth;
    for (var r = 1; r <= rem; r++) {
      html += '<div class="cal-day other-month">' + r + '</div>';
    }

    // .html() replaces ALL content of #calendar-grid with the new calendar HTML
    $('#calendar-grid').html(html);
  }

  // Click on calendar day — show toast
  $(document).on('click', '.cal-day:not(.other-month)', function () {
    var day    = $(this).data('day');
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    if (day) showToast('Selected: ' + months[calMonth] + ' ' + day + ', ' + calYear, 'info');
  });

  $('#cal-prev').on('click', function () {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderCal();
  });

  $('#cal-next').on('click', function () {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderCal();
  });

  initCal(); // Initialize on page load


  /* ============================================================
     SECTION 10 — FORMS: Add Hours, Profile, Password
     ------------------------------------------------------------
     WHAT IT DOES:
     - Add Hours: saves operating hours per day
     - Sunday checkbox: enables/disables time inputs
     - Profile: saves user info
     - Password: validates match before saving

     JQUERY USED:
     .on('change', fn) on a checkbox
       → Fires when checkbox is checked or unchecked.

     .prop('checked')
       → Returns true if checkbox is currently checked.

     .prop('disabled', bool)
       → Disables or enables an input element.
   ============================================================ */

  // Toggle Sunday inputs when Sunday checkbox changes
  $(document).on('change', '.day-checkbox', function () {
    var $row    = $(this).closest('.hours-row');
    var checked = $(this).prop('checked'); // true or false
    // Find all time inputs in this row and enable/disable them
    $row.find('input[type=time]').prop('disabled', !checked);
  });

  // ADD HOURS FORM SUBMIT
  $('#add-hours-form').on('submit', function (e) {
    e.preventDefault();
    showToast('Operating hours saved! ✅', 'success');
    $('#modal-add-hours').removeClass('open');
  });

  // PROFILE FORM SUBMIT
  $('#profile-form').on('submit', function (e) {
    e.preventDefault();
    var name  = $('#profile-fname').val().trim();
    var email = $('#profile-email').val().trim();
    if (!name || !email) { showToast('Name and email are required.', 'warning'); return; }

    // Update the displayed name in the profile banner and sidebar
    $('#profile-display-name').text(name);
    $('.nav-avatar').text(name.charAt(0).toUpperCase() + (name.split(' ')[1] ? name.split(' ')[1].charAt(0).toUpperCase() : ''));
    showToast('Profile updated! ✅', 'success');
  });

  // PASSWORD CHANGE FORM
  $('#password-form').on('submit', function (e) {
    e.preventDefault();
    var current = $('#pass-current').val();
    var newPass  = $('#pass-new').val();
    var confirm  = $('#pass-confirm').val();

    if (!current || !newPass || !confirm) {
      showToast('Fill all password fields.', 'warning'); return;
    }
    if (newPass.length < 8) {
      showToast('Password must be at least 8 characters.', 'warning'); return;
    }
    if (newPass !== confirm) {
      showToast('Passwords do not match!', 'danger'); return;
    }
    showToast('Password changed successfully! 🔐', 'success');
    $(this)[0].reset();
  });


  /* ============================================================
     SECTION 11 — NOTIFICATIONS TOGGLE
     ------------------------------------------------------------
     JQUERY USED:
     .on('change', fn) on a toggle/checkbox
       → Fires when toggle state changes.

     .prop('checked')
       → Gets current state of a checkbox (true/false).
   ============================================================ */
  $(document).on('change', '.setting-toggle', function () {
    var label   = $(this).closest('.setting-row').find('.setting-label').text();
    var isOn    = $(this).prop('checked');
    showToast(label + ' ' + (isOn ? 'enabled ✅' : 'disabled'), isOn ? 'success' : 'warning');
  });


  /* ============================================================
     SECTION 12 — CHART BARS ANIMATION
     ------------------------------------------------------------
     WHAT IT DOES:
     Animates bar chart heights from 0 to their target value.
     The target is stored in data-h="60" HTML attribute.

     JQUERY USED:
     $('.bar[data-h]')
       → Selects all .bar elements that HAVE a data-h attribute.

     .each(fn)
       → Loops through each matched element one by one.

     .data('h')
       → Reads the data-h="60" attribute value.

     .css('height', value)
       → Sets inline CSS height. Combined with CSS transition,
         this creates the smooth grow animation.
   ============================================================ */
  function animateBars() {
    $('.bar[data-h]').each(function () {
      var $bar      = $(this);
      var targetH   = $bar.data('h'); // Read data-h="60" → 60
      $bar.css('height', targetH + '%'); // CSS transition does the animation
    });
  }
  setTimeout(animateBars, 400); // Run once on page load for initial bars


  /* ============================================================
     SECTION 13 — LIVE OVERVIEW SIMULATION
     ------------------------------------------------------------
     WHAT IT DOES:
     Simulates real-time occupancy changes every 3.5 seconds.
     Only runs while the Live page is active (performance).

     JQUERY USED:
     setInterval(fn, ms)
       → Vanilla JS timer that repeats fn every ms milliseconds.

     .hasClass('active')
       → Returns true if element has the 'active' class.
         Used to check if user is currently on the Live page.

     .data('pct') / .data('pct', newValue)
       → .data('key')      → reads stored data
       → .data('key', val) → writes/updates stored data
         (does NOT change the HTML, only jQuery's memory)

     .css('width', value)
       → Sets the CSS width, triggering the smooth transition
         animation defined in style.css.
   ============================================================ */
  setInterval(function () {
    if ($('#page-live').hasClass('active')) {
      // Loop through all occupancy fill bars
      $('.occ-fill').each(function () {
        var current = parseFloat($(this).data('pct') || 50);
        // Small random change ±3%
        var newPct  = Math.min(97, Math.max(8, current + (Math.random() - 0.5) * 6));
        $(this).data('pct', newPct); // Store new value in jQuery memory
        $(this).css('width', newPct.toFixed(1) + '%'); // Update bar width

        // Change color based on occupancy level
        var $bar = $(this);
        if (newPct >= 85) {
          $bar.css('background', 'var(--danger)');
        } else if (newPct >= 60) {
          $bar.css('background', 'var(--warning)');
        } else {
          $bar.css('background', 'var(--success)');
        }

        // Update the percentage text next to the bar
        $(this).closest('.occ-row').find('.occ-pct').text(Math.round(newPct) + '%');
      });

      // Update the live clock
      $('#live-clock').text(new Date().toLocaleTimeString('en-US'));
    }
  }, 3500);


  /* ============================================================
     SECTION 14 — GLOBAL SEARCH (Navbar)
     ------------------------------------------------------------
     WHAT IT DOES:
     Searches across all visible content on the current
     active page and highlights matching text.

     JQUERY USED:
     .val()
       → Gets current value of the search input.

     .text().toLowerCase()
       → Gets text content of an element, normalized to lowercase.
   ============================================================ */
  $('#global-search').on('keyup', function () {
    var q = $(this).val().toLowerCase().trim();
    if (!q) return;

    // Search within the currently active page
    var $activePage = $('.module-page.active');
    var found       = false;

    $activePage.find('td, .lot-name, .res-id, .lot-detail').each(function () {
      if ($(this).text().toLowerCase().includes(q)) {
        found = true;
        return false; // Break out of .each() loop
      }
    });

    if (found) {
      showToast('Results found for "' + q + '"', 'info');
    }
  });


  /* ============================================================
     SECTION 15 — ANALYSIS PAGE (Filter by Month)
     ------------------------------------------------------------
     JQUERY USED:
     .on('change') on a select dropdown
       → Fires when the user selects a different option.

     .text()
       → Updates text labels on chart.
   ============================================================ */
  $('#analysis-month').on('change', function () {
    var month = $(this).val();
    // Simulate different data for different months
    var mockData = {
      'February 2026': [55,72,45,80,65,90,78,62],
      'January 2026':  [40,55,65,50,70,85,60,45],
      'December 2025': [80,75,90,85,95,88,72,68]
    };
    var data = mockData[month] || mockData['February 2026'];

    // Update each bar height with animation
    $('.bar[data-h]').each(function (i) {
      if (data[i]) {
        $(this).data('h', data[i]).css('height', data[i] + '%');
      }
    });
    showToast('Showing data for ' + month, 'info');
  });


  /* ============================================================
     SECTION 16 — NOTIFICATION BELL (Dropdown)
     ------------------------------------------------------------
     JQUERY USED:
     .toggleClass('open')
       → Adds 'open' if it doesn't exist, removes it if it does.
         One-liner toggle!

     .not(selector) + .outside click
       → Close dropdown when clicking anywhere else.
   ============================================================ */
  $('#notif-btn').on('click', function (e) {
    e.stopPropagation(); // Don't bubble up to document
    $('#notif-dropdown').toggleClass('open');
  });

  $(document).on('click', function () {
    $('#notif-dropdown').removeClass('open'); // Close when clicking outside
  });

  $('#mark-all-read').on('click', function () {
    // Remove unread indicators from all notification items
    $('.notif-item.unread').removeClass('unread');
    $('#notif-count').hide(); // Hide the red dot badge
    showToast('All notifications marked as read.', 'success');
  });


  /* ============================================================
     INITIAL SETUP — Runs once on page load
  ============================================================ */
  showToast('Welcome to ParkSmart! 🚗', 'success');

}); // END $(document).ready