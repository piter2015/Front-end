import enableGesture from './js/enableGesture';

const PROPERTY_SYMBOL = Symbol("property");
const ATTRIBUTE_SYMBOL = Symbol("attribute");
const EVENT_SYMBOL = Symbol("event");
const STATE_SYMBOL = Symbol("state");

class Component {
    constructor() {
        this[ATTRIBUTE_SYMBOL] = Object.create(null);
        this[PROPERTY_SYMBOL] = Object.create(null);
        this[STATE_SYMBOL] = Object.create(null);
        this[EVENT_SYMBOL] = Object.create(null);
    }
    created() {
        throw new Error('should define in subclass');
    }
    mounted(){
        throw new Error('should define in subclass');
    }
    unmounted(){
        throw new Error('should define in subclass');
    }
    update(){
        throw new Error('should define in subclass');
    }
    getAttribute(name){
        return this[ATTRIBUTE_SYMBOL][name]
    }
    setAttribute(name, value){
        return this[ATTRIBUTE_SYMBOL][name] = value;
    }
    addEventListener(type, listener){
        if(!this[EVENT_SYMBOL][type])
            this[EVENT_SYMBOL][type] = new Set;
        this[EVENT_SYMBOL][type].add(listener);
    }
    removeEventListener(type, listener){
        if(!this[EVENT_SYMBOL][type])
            return;
        this[EVENT_SYMBOL][type].delete(listener);
    }
    triggerEvent(type){
        if(!this[EVENT_SYMBOL][type]) return;
        for(let event of this[EVENT_SYMBOL][type])
            event.call(this);
    }
}

export class Carousel extends Component {
    constructor() {
        super();
        this.timer = null;
        this.create();
    }
    create() {

    }
    appendTo(element){
        this.mount(element);
    }

    set data(val) {
        return this[ATTRIBUTE_SYMBOL].data = val;
    }
    get data() {
        return this[ATTRIBUTE_SYMBOL].data;
    }

    set auto(val) {
        // debugger;
        return this[ATTRIBUTE_SYMBOL].auto = val;
    }
    get auto() {
        return true; // this[ATTRIBUTE_SYMBOL].auto;
    }

    set position(val) {
        return this[STATE_SYMBOL].position = val;
    }
    get position() {
        return this[STATE_SYMBOL].position
    }
    set timer(val) {
        return this[STATE_SYMBOL].timer = val;
    }
    get timer() {
        return this[STATE_SYMBOL].timer;
    }
    set container(val) {
        return this[STATE_SYMBOL].container = val;
    }
    get container() {
        return this[STATE_SYMBOL].container;
    }
    /** 水平位移 */
    set disX(val) {
        return this[STATE_SYMBOL].disX = val;
    }
    get disX() {
        return this[STATE_SYMBOL].disX;
    }
    /** 鼠标最初位置 */
    set startX(val) {
        return this[STATE_SYMBOL].startX = val;
    }
    get startX() {
        return this[STATE_SYMBOL].startX;
    }
    /** 轮播宽度 */
    get width() {
        console.log(this.container.offsetWidth);
        return this.container.offsetWidth;
    }
    mount(container) {
        const data = this.data;
        this[PROPERTY_SYMBOL].children = [];
        this[PROPERTY_SYMBOL].position = 0;
        for (let src of data) {
            const item = document.createElement('img');
            item.src = src;
            item.style = "width: 7.04rem";
            this[PROPERTY_SYMBOL].children.push(item);
        }
        this.container = container;
        this.container.classList.add('carousel');
        this[PROPERTY_SYMBOL].children.forEach(child => {
            container.appendChild(child);
        });
        this.mounted();
        // this.render();
    }
    mounted() {
        this.position = 0;
        // 注释此行禁止原始拖动代码
        enableGesture(this.container);
        this.container.addEventListener('pan', this.panHandler.bind(this));
        this.container.addEventListener('flick', this.flickHandler.bind(this));
        this.container.addEventListener('panend', this.panendHandler.bind(this));
        this.container.addEventListener('mousedown', (event) => {
            event.preventDefault();
        });
        this.container.addEventListener('touchmove', (event) => {
            event.stopPropagation();
        });
        // setTimeout(this.nextFrame.bind(this), 1000);
    }
    render() {
        // 将子元素转化为普通数组
    }
    panHandler(event) {
        console.log('pan');
        this.disX = event.clientX - this.startX;
        for (let child of this[PROPERTY_SYMBOL].children) {
            child.style.transition = 'all 0s ease 0s';
            child.style.transform = `translate(${-this.position * this.width + event.dx}px)`;
        }
    }
    panendHandler(event) {
        if (event.isFlick) return;
        console.log('panend');

        this.position = -Math.round((-this.position * this.width + event.dx) / this.width);
        this.position = Math.max(0, Math.min(this.position, this[PROPERTY_SYMBOL].children.length - 1));
        for (let child of this[PROPERTY_SYMBOL].children) {
            child.style.transition = '';
            child.style.transform = `translate(${-this.position * this.width}px)`;
        }
        this.triggerEvent('panend');
    }
    flickHandler(event) {
        if (event.dx < 0) {
            this.position += 1;
        } else {
            this.position -= 1;
        }
        this.position = Math.max(0, Math.min(this.position, this[PROPERTY_SYMBOL].children.length - 1));
        for (let child of this[PROPERTY_SYMBOL].children) {
            child.style.transition = '';
            child.style.transform = `translate(${-this.position * this.width}px)`;
        }
    }
    start(event) {
        this.triggerEvent('movestart');
        event.preventDefault();
        this.startX = event.clientX;
        this.disX = 0;
        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', end);
    }
    move(event) {
        this.triggerEvent('move');
        event.preventDefault();
        this.disX = event.clientX - this.startX;
        for (let child of this[PROPERTY_SYMBOL].children) {
            child.style.transition = 'ease 0s';
            child.style.transform = `translate(${-this.position * this.width + this.disX}px)`;
        }
    }
    end() {
        this.position = -Math.round((-this.position * this.width + this.disX) / this.width);
        this.position = Math.max(0, Math.min(this.position, this[PROPERTY_SYMBOL].children.length - 1));
        for (let child of this[PROPERTY_SYMBOL].children) {
            child.style.transition = '';
            child.style.transform = `translate(${-this.position * this.width}px)`;
        }
        document.removeEventListener('mousemove', this.move);
        document.removeEventListener('mouseup', this.move);
        this.triggerEvent('moveend');
    }
    nextFrame() {
        /** 下一轮播位置 */
        let nextPosition = this.position + 1;
        nextPosition = nextPosition % this[PROPERTY_SYMBOL].children.length;
        /** 当前轮播元素 */
        const current = this[PROPERTY_SYMBOL].children[this.position];
        /** 下一轮播元素 */
        const next = this[PROPERTY_SYMBOL].children[nextPosition];

        next.style.transition = 'ease 1s';
        next.style.transform = `translate(${ -nextPosition * 100 + 100 }%)`;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                current.style.transform = `translate(${ -100 - 100 * this.position }%)`;
                next.style.transition = 'ease 1s';
                next.style.transform = `translate(${ -nextPosition * 100 }%)`;
                this.position = nextPosition;
            });
        });
        // this.timer = setTimeout(this.nextFrame.bind(this), 1000);
    }
}
