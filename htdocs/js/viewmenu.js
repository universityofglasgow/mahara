/**
 * Javascript for the view menu
 * @source: http://gitorious.org/mahara/mahara
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL version 3 or later
 * @copyright  For copyright information on Mahara, please see the README file distributed with this software.
 *
 */

function addFeedbackSuccess(form, data) {
    addElementClass('add_feedback_form', 'hidden');
    if ($('overlay')) {
        removeElement('overlay');
    }
    paginator.updateResults(data);
    // Clear rating from previous submission
    forEach(getElementsByTagAndClassName('input', 'star', 'add_feedback_form_rating_container'), function (r) {
        r.checked = false;
    });
    paginator.alertProxy('pagechanged', data['data']);

    // Clear TinyMCE
    if (isTinyMceUsed()) {
        tinyMCE.activeEditor.setContent('');
    }

    // Clear the textarea (in case TinyMCE is disabled)
    var messageid = 'message';
    if (data.fieldnames && data.fieldnames.message) {
        messageid = data.fieldnames.message;
    }
    $('add_feedback_form_' + messageid).value = '';

    rewriteCancelButtons();
    formSuccess(form, data);
}

function objectionSuccess(form, data) {
    addElementClass('objection_form', 'hidden');
    $('objection_form_message').value = '';
    rewriteCancelButtons();
    formSuccess(form, data);
}

function moveFeedbackForm(tinymceused) {
    if (tinymceused) {
        tinyMCE.execCommand('mceRemoveControl', false, 'add_feedback_form_message');
    }
    form = $('add_feedback_form');
    removeElement(form);
    appendChildNodes($('add_feedback_link').parentNode, form);
    if (tinymceused) {
       tinyMCE.execCommand('mceAddControl', false, 'add_feedback_form_message');
    }
}

function rewriteCancelButtons() {
    if ($('add_feedback_form')) {
        var buttons = getElementsByTagAndClassName('input', 'cancel', 'add_feedback_form');
        // hashed field names on anon forms mean we don't know the exact id of this button
        var idprefix = 'cancel_add_feedback_form_';
        forEach(buttons, function(button) {
            if (getNodeAttribute(button, 'id').substring(0, idprefix.length) == idprefix) {
                disconnectAll(button);
                connect(button, 'onclick', function (e) {
                    e.stop();
                    addElementClass('add_feedback_form', 'hidden');
                    if ($('overlay')) {
                        removeElement('overlay');
                    }
                    return false;
                });
            }
        });
    }
    if ($('cancel_objection_form_submit')) {
        disconnectAll('cancel_objection_form_submit');
        connect('cancel_objection_form_submit', 'onclick', function (e) {
            e.stop();
            addElementClass('objection_form', 'hidden');
            return false;
        });
    }
}

function isTinyMceUsed() {
    return (typeof(tinyMCE) != 'undefined' && typeof(tinyMCE.get('add_feedback_form_message')) != 'undefined');
}

addLoadEvent(function () {
    if ($('add_feedback_form')) {
        if ($('add_feedback_link')) {

            var isIE6 = document.all && !window.opera &&
                (!document.documentElement || typeof(document.documentElement.style.maxHeight) == "undefined");

            connect('add_feedback_link', 'onclick', function(e) {
                var tinymceused = isTinyMceUsed();

                e.stop();
                if ($('objection_form')) {
                    addElementClass('objection_form', 'hidden');
                }
                removeElementClass('add_feedback_form', 'js-hidden');
                removeElementClass('add_feedback_form', 'hidden');
                if (typeof(feedbacklinkinblock) != 'undefined') {
                    // need to display it as a 'popup' form
                    moveFeedbackForm(tinymceused);
                    addElementClass('add_feedback_form', 'blockinstance');
                    addElementClass('add_feedback_form', 'configure');
                    addElementClass('add_feedback_form', 'feedback_form_overlay');
                    var formposition = new Object();
                    formposition.x = (((getViewportDimensions().w / 2) - 300) > 0) ? (getViewportDimensions().w / 2) - 300 : 0;
                    formposition.y = 30;
                    setElementPosition('add_feedback_form', formposition);
                    appendChildNodes(document.body, DIV({id: 'overlay'}));
                }
                // IE6 fails to hide tinymce properly after feedback
                // submission, so force it to reload the page by disconnecting
                // the submit handler
                if (isIE6) {
                    disconnectAll('add_feedback_form', 'onsubmit');
                }

                if (tinymceused) {
                    tinyMCE.get('add_feedback_form_message').focus();
                }
                else {
                    $('add_feedback_form_message').focus();
                }

                return false;
            });
        }
    }

    if ($('objection_form')) {
        if ($('objection_link')) {
            connect('objection_link', 'onclick', function(e) {
                e.stop();
                if ($('add_feedback_form')) {
                    addElementClass('add_feedback_form', 'hidden');
                }
                removeElementClass('objection_form', 'js-safe-hidden');
                removeElementClass('objection_form', 'hidden');
                return false;
            });
        }
    }

    rewriteCancelButtons();

    if ($('toggle_watchlist_link')) {
        connect('toggle_watchlist_link', 'onclick', function (e) {
            e.stop();
            if (typeof artefactid === 'undefined') {
                artefactid = null;
            }
            sendjsonrequest(config.wwwroot + 'view/togglewatchlist.json.php', {'view': viewid, 'artefact': artefactid}, 'POST', function(data) {
                $('toggle_watchlist_link').innerHTML = data.newtext;
            });
        });
    }
});
