/* global describe, it */

var analytics=undefined;
(function () {
    'use strict';

    describe('Analytics Module', function() {
        analytics = new Analytics().init();

        it('should insert tracker to the background page', function() {
            var tracker = document.getElementById('tracker');
            expect(tracker).to.not.equal(undefined);
        });

        it('should track events', function() {
            var isEventTracked = analytics.track('Toto');
            expect(isEventTracked).to.equal(true);
        });
    });
})();
