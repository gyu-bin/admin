import utils from './utils';

/**
 * 요소를 불완전하게 표시하는 조상 요소 가져오기
 */
const { getParent } = utils;

function getOffsetParent(element) {
    if (utils.isWindow(element) || element.nodeType === 9) {
        return null;
    }
    // ie 이것도 완전히 가능한 것은 아니다
    /*
     <div style="width: 50px;height: 100px;overflow: hidden">
     <div style="width: 50px;height: 100px;position: relative;" id="d6">
     element 6 height 100px weigth 50px<br/>
     </div>
     </div>
     */
    // element.offsetParent does the right thing in ie7 and below. Return parent with layout!
    //  In other browsers it only includes elements with position absolute, relative or
    // fixed, not elements with overflow set to auto or scroll.
    //        if (UA.ie && ieMode < 8) {
    //            return element.offsetParent;
    //        }
    // 통일된 offsetParent 방법
    const doc = utils.getDocument(element);
    const body = doc.body;
    let parent;
    let positionStyle = utils.css(element, 'position');
    const skipStatic = positionStyle === 'fixed' || positionStyle === 'absolute';

    if (!skipStatic) {
        return element.nodeName.toLowerCase() === 'html'
            ? null
            : getParent(element);
    }

    for (
        parent = getParent(element);
        parent && parent !== body && parent.nodeType !== 9;
        parent = getParent(parent)
    ) {
        positionStyle = utils.css(parent, 'position');
        if (positionStyle !== 'static') {
            return parent;
        }
    }
    return null;
}

export default getOffsetParent;
