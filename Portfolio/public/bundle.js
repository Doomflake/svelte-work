
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
            : ctx.$$scope.ctx;
    }
    function get_slot_changes(definition, ctx, changed, fn) {
        return definition[1]
            ? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
            : ctx.$$scope.changed || {};
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function createEventDispatcher() {
        const component = current_component;
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment) {
            $$.update($$.dirty);
            run_all($$.before_update);
            $$.fragment.p($$.dirty, $$.ctx);
            $$.dirty = null;
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        if (component.$$.fragment) {
            run_all(component.$$.on_destroy);
            component.$$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            component.$$.on_destroy = component.$$.fragment = null;
            component.$$.ctx = {};
        }
    }
    function make_dirty(component, key) {
        if (!component.$$.dirty) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty = blank_object();
        }
        component.$$.dirty[key] = true;
    }
    function init(component, options, instance, create_fragment, not_equal, prop_names) {
        const parent_component = current_component;
        set_current_component(component);
        const props = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props: prop_names,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty: null
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, props, (key, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[key], $$.ctx[key] = value)) {
                    if ($$.bound[key])
                        $$.bound[key](value);
                    if (ready)
                        make_dirty(component, key);
                }
                return ret;
            })
            : props;
        $$.update();
        ready = true;
        run_all($$.before_update);
        $$.fragment = create_fragment($$.ctx);
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src/Button.svelte generated by Svelte v3.12.1 */

    const file = "src/Button.svelte";

    function create_fragment(ctx) {
    	var button, current, dispose;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			button = element("button");

    			if (default_slot) default_slot.c();

    			attr_dev(button, "class", "svelte-1nrh7e6");
    			add_location(button, file, 14, 0, 297);
    			dispose = listen_dev(button, "click", ctx.click_handler);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(button_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { click_handler, $$slots, $$scope };
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Button", options, id: create_fragment.name });
    	}
    }

    /* src/Product.svelte generated by Svelte v3.12.1 */

    const file$1 = "src/Product.svelte";

    // (43:0) <Button on:click="{addToCart}">
    function create_default_slot(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Add to Cart");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot.name, type: "slot", source: "(43:0) <Button on:click=\"{addToCart}\">", ctx });
    	return block;
    }

    function create_fragment$1(ctx) {
    	var div, h1, t0, t1, h2, t2, t3, p, t4, t5, current;

    	var button = new Button({
    		props: {
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});
    	button.$on("click", ctx.addToCart);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text(ctx.productTitle);
    			t1 = space();
    			h2 = element("h2");
    			t2 = text(ctx.productPrice);
    			t3 = space();
    			p = element("p");
    			t4 = text(ctx.productDescription);
    			t5 = space();
    			button.$$.fragment.c();
    			attr_dev(h1, "class", "svelte-1829195");
    			add_location(h1, file$1, 39, 0, 734);
    			attr_dev(h2, "class", "svelte-1829195");
    			add_location(h2, file$1, 40, 0, 758);
    			attr_dev(p, "class", "svelte-1829195");
    			add_location(p, file$1, 41, 0, 782);
    			attr_dev(div, "class", "svelte-1829195");
    			add_location(div, file$1, 38, 0, 728);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(div, t1);
    			append_dev(div, h2);
    			append_dev(h2, t2);
    			append_dev(div, t3);
    			append_dev(div, p);
    			append_dev(p, t4);
    			append_dev(div, t5);
    			mount_component(button, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (!current || changed.productTitle) {
    				set_data_dev(t0, ctx.productTitle);
    			}

    			if (!current || changed.productPrice) {
    				set_data_dev(t2, ctx.productPrice);
    			}

    			if (!current || changed.productDescription) {
    				set_data_dev(t4, ctx.productDescription);
    			}

    			var button_changes = {};
    			if (changed.$$scope) button_changes.$$scope = { changed, ctx };
    			button.$set(button_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(button);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$1.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	
        let { productTitle, productDescription, productPrice } = $$props;

        const dispatch = createEventDispatcher();

        function addToCart() {
                dispatch('addcart', productTitle);
        }

    	const writable_props = ['productTitle', 'productDescription', 'productPrice'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Product> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('productTitle' in $$props) $$invalidate('productTitle', productTitle = $$props.productTitle);
    		if ('productDescription' in $$props) $$invalidate('productDescription', productDescription = $$props.productDescription);
    		if ('productPrice' in $$props) $$invalidate('productPrice', productPrice = $$props.productPrice);
    	};

    	$$self.$capture_state = () => {
    		return { productTitle, productDescription, productPrice };
    	};

    	$$self.$inject_state = $$props => {
    		if ('productTitle' in $$props) $$invalidate('productTitle', productTitle = $$props.productTitle);
    		if ('productDescription' in $$props) $$invalidate('productDescription', productDescription = $$props.productDescription);
    		if ('productPrice' in $$props) $$invalidate('productPrice', productPrice = $$props.productPrice);
    	};

    	return {
    		productTitle,
    		productDescription,
    		productPrice,
    		addToCart
    	};
    }

    class Product extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, ["productTitle", "productDescription", "productPrice"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Product", options, id: create_fragment$1.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.productTitle === undefined && !('productTitle' in props)) {
    			console.warn("<Product> was created without expected prop 'productTitle'");
    		}
    		if (ctx.productDescription === undefined && !('productDescription' in props)) {
    			console.warn("<Product> was created without expected prop 'productDescription'");
    		}
    		if (ctx.productPrice === undefined && !('productPrice' in props)) {
    			console.warn("<Product> was created without expected prop 'productPrice'");
    		}
    	}

    	get productTitle() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productTitle(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get productDescription() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productDescription(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get productPrice() {
    		throw new Error("<Product>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set productPrice(value) {
    		throw new Error("<Product>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Cart.svelte generated by Svelte v3.12.1 */

    const file$2 = "src/Cart.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.item = list[i];
    	return child_ctx;
    }

    // (29:0) {:else}
    function create_else_block(ctx) {
    	var ul, t0, h1, t1, t2;

    	let each_value = ctx.items;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			h1 = element("h1");
    			t1 = text("TOTAL: $");
    			t2 = text(ctx.cartTotal);
    			attr_dev(ul, "class", "svelte-yw0sed");
    			add_location(ul, file$2, 29, 0, 460);
    			attr_dev(h1, "class", "svelte-yw0sed");
    			add_location(h1, file$2, 35, 0, 544);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    		},

    		p: function update(changed, ctx) {
    			if (changed.items) {
    				each_value = ctx.items;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}
    				each_blocks.length = each_value.length;
    			}

    			if (changed.cartTotal) {
    				set_data_dev(t2, ctx.cartTotal);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(ul);
    			}

    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(t0);
    				detach_dev(h1);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block.name, type: "else", source: "(29:0) {:else}", ctx });
    	return block;
    }

    // (27:0) {#if items.length === 0}
    function create_if_block(ctx) {
    	var p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No items in cart yet.";
    			add_location(p, file$2, 27, 4, 423);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},

    		p: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(p);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block.name, type: "if", source: "(27:0) {#if items.length === 0}", ctx });
    	return block;
    }

    // (31:0) {#each items as item}
    function create_each_block(ctx) {
    	var li, t0_value = ctx.item.title + "", t0, t1, t2_value = ctx.item.price + "", t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = text(" - $");
    			t2 = text(t2_value);
    			attr_dev(li, "class", "svelte-yw0sed");
    			add_location(li, file$2, 31, 4, 491);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    		},

    		p: function update(changed, ctx) {
    			if ((changed.items) && t0_value !== (t0_value = ctx.item.title + "")) {
    				set_data_dev(t0, t0_value);
    			}

    			if ((changed.items) && t2_value !== (t2_value = ctx.item.price + "")) {
    				set_data_dev(t2, t2_value);
    			}
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(li);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block.name, type: "each", source: "(31:0) {#each items as item}", ctx });
    	return block;
    }

    function create_fragment$2(ctx) {
    	var if_block_anchor;

    	function select_block_type(changed, ctx) {
    		if (ctx.items.length === 0) return create_if_block;
    		return create_else_block;
    	}

    	var current_block_type = select_block_type(null, ctx);
    	var if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},

    		p: function update(changed, ctx) {
    			if (current_block_type === (current_block_type = select_block_type(changed, ctx)) && if_block) {
    				if_block.p(changed, ctx);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);
    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},

    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if_block.d(detaching);

    			if (detaching) {
    				detach_dev(if_block_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$2.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { items } = $$props;

    	const writable_props = ['items'];
    	Object.keys($$props).forEach(key => {
    		if (!writable_props.includes(key) && !key.startsWith('$$')) console.warn(`<Cart> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ('items' in $$props) $$invalidate('items', items = $$props.items);
    	};

    	$$self.$capture_state = () => {
    		return { items, cartTotal };
    	};

    	$$self.$inject_state = $$props => {
    		if ('items' in $$props) $$invalidate('items', items = $$props.items);
    		if ('cartTotal' in $$props) $$invalidate('cartTotal', cartTotal = $$props.cartTotal);
    	};

    	let cartTotal;

    	$$self.$$.update = ($$dirty = { items: 1 }) => {
    		if ($$dirty.items) { $$invalidate('cartTotal', cartTotal = items.reduce((sum, curValue) => {
                return sum + curValue.price;
            }, 0)); }
    	};

    	return { items, cartTotal };
    }

    class Cart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, ["items"]);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Cart", options, id: create_fragment$2.name });

    		const { ctx } = this.$$;
    		const props = options.props || {};
    		if (ctx.items === undefined && !('items' in props)) {
    			console.warn("<Cart> was created without expected prop 'items'");
    		}
    	}

    	get items() {
    		throw new Error("<Cart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Cart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Navbutton.svelte generated by Svelte v3.12.1 */

    const file$3 = "src/Navbutton.svelte";

    function create_fragment$3(ctx) {
    	var button, current;

    	const default_slot_template = ctx.$$slots.default;
    	const default_slot = create_slot(default_slot_template, ctx, null);

    	const block = {
    		c: function create() {
    			button = element("button");

    			if (default_slot) default_slot.c();

    			attr_dev(button, "class", "svelte-12bin4e");
    			add_location(button, file$3, 10, 0, 128);
    		},

    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(button_nodes);
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (default_slot && default_slot.p && changed.$$scope) {
    				default_slot.p(
    					get_slot_changes(default_slot_template, ctx, changed, null),
    					get_slot_context(default_slot_template, ctx, null)
    				);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(button);
    			}

    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$3.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots = {}, $$scope } = $$props;

    	$$self.$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {};

    	return { $$slots, $$scope };
    }

    class Navbutton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Navbutton", options, id: create_fragment$3.name });
    	}
    }

    /* src/Navbar.svelte generated by Svelte v3.12.1 */

    const file$4 = "src/Navbar.svelte";

    // (12:0) <Navbutton>
    function create_default_slot_3(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_3.name, type: "slot", source: "(12:0) <Navbutton>", ctx });
    	return block;
    }

    // (13:0) <Navbutton>
    function create_default_slot_2(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_2.name, type: "slot", source: "(13:0) <Navbutton>", ctx });
    	return block;
    }

    // (14:0) <Navbutton>
    function create_default_slot_1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Contact");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot_1.name, type: "slot", source: "(14:0) <Navbutton>", ctx });
    	return block;
    }

    // (15:0) <Navbutton>
    function create_default_slot$1(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Examples");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$1.name, type: "slot", source: "(15:0) <Navbutton>", ctx });
    	return block;
    }

    function create_fragment$4(ctx) {
    	var div, t0, t1, t2, current;

    	var navbutton0 = new Navbutton({
    		props: {
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var navbutton1 = new Navbutton({
    		props: {
    		$$slots: { default: [create_default_slot_2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var navbutton2 = new Navbutton({
    		props: {
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	var navbutton3 = new Navbutton({
    		props: {
    		$$slots: { default: [create_default_slot$1] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});

    	const block = {
    		c: function create() {
    			div = element("div");
    			navbutton0.$$.fragment.c();
    			t0 = space();
    			navbutton1.$$.fragment.c();
    			t1 = space();
    			navbutton2.$$.fragment.c();
    			t2 = space();
    			navbutton3.$$.fragment.c();
    			attr_dev(div, "class", "svelte-xt2kfo");
    			add_location(div, file$4, 10, 0, 137);
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(navbutton0, div, null);
    			append_dev(div, t0);
    			mount_component(navbutton1, div, null);
    			append_dev(div, t1);
    			mount_component(navbutton2, div, null);
    			append_dev(div, t2);
    			mount_component(navbutton3, div, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var navbutton0_changes = {};
    			if (changed.$$scope) navbutton0_changes.$$scope = { changed, ctx };
    			navbutton0.$set(navbutton0_changes);

    			var navbutton1_changes = {};
    			if (changed.$$scope) navbutton1_changes.$$scope = { changed, ctx };
    			navbutton1.$set(navbutton1_changes);

    			var navbutton2_changes = {};
    			if (changed.$$scope) navbutton2_changes.$$scope = { changed, ctx };
    			navbutton2.$set(navbutton2_changes);

    			var navbutton3_changes = {};
    			if (changed.$$scope) navbutton3_changes.$$scope = { changed, ctx };
    			navbutton3.$set(navbutton3_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbutton0.$$.fragment, local);

    			transition_in(navbutton1.$$.fragment, local);

    			transition_in(navbutton2.$$.fragment, local);

    			transition_in(navbutton3.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(navbutton0.$$.fragment, local);
    			transition_out(navbutton1.$$.fragment, local);
    			transition_out(navbutton2.$$.fragment, local);
    			transition_out(navbutton3.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(div);
    			}

    			destroy_component(navbutton0);

    			destroy_component(navbutton1);

    			destroy_component(navbutton2);

    			destroy_component(navbutton3);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$4.name, type: "component", source: "", ctx });
    	return block;
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$4, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "Navbar", options, id: create_fragment$4.name });
    	}
    }

    /* src/App.svelte generated by Svelte v3.12.1 */

    const file$5 = "src/App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = Object.create(ctx);
    	child_ctx.product = list[i];
    	return child_ctx;
    }

    // (64:0) <Button on:click="{createProduct}">
    function create_default_slot$2(ctx) {
    	var t;

    	const block = {
    		c: function create() {
    			t = text("Create Product");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(t);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_default_slot$2.name, type: "slot", source: "(64:0) <Button on:click=\"{createProduct}\">", ctx });
    	return block;
    }

    // (69:1) {:else}
    function create_else_block$1(ctx) {
    	var each_1_anchor, current;

    	let each_value = ctx.products;

    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},

    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			if (changed.products) {
    				each_value = ctx.products;

    				let i;
    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(changed, child_ctx);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();
    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}
    				check_outros();
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},

    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);

    			if (detaching) {
    				detach_dev(each_1_anchor);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_else_block$1.name, type: "else", source: "(69:1) {:else}", ctx });
    	return block;
    }

    // (67:0) {#if products.length === 0}
    function create_if_block$1(ctx) {
    	var p;

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "No Products Were Added Yet";
    			add_location(p, file$5, 67, 1, 1329);
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    		},

    		p: noop,
    		i: noop,
    		o: noop,

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(p);
    			}
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_if_block$1.name, type: "if", source: "(67:0) {#if products.length === 0}", ctx });
    	return block;
    }

    // (70:1) {#each products as product}
    function create_each_block$1(ctx) {
    	var current;

    	var product = new Product({
    		props: {
    		productTitle: ctx.product.title,
    		productPrice: ctx.product.price,
    		productDescription: ctx.product.description
    	},
    		$$inline: true
    	});
    	product.$on("addcart", ctx.addToCart);

    	const block = {
    		c: function create() {
    			product.$$.fragment.c();
    		},

    		m: function mount(target, anchor) {
    			mount_component(product, target, anchor);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var product_changes = {};
    			if (changed.products) product_changes.productTitle = ctx.product.title;
    			if (changed.products) product_changes.productPrice = ctx.product.price;
    			if (changed.products) product_changes.productDescription = ctx.product.description;
    			product.$set(product_changes);
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(product.$$.fragment, local);

    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(product.$$.fragment, local);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			destroy_component(product, detaching);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_each_block$1.name, type: "each", source: "(70:1) {#each products as product}", ctx });
    	return block;
    }

    function create_fragment$5(ctx) {
    	var section0, t0, t1, hr, t2, section1, div0, label0, t4, input0, t5, div1, label1, t7, input1, input1_updating = false, t8, div2, label2, t10, textarea, t11, t12, section2, current_block_type_index, if_block, current, dispose;

    	var navbar = new Navbar({ $$inline: true });

    	var cart = new Cart({
    		props: { items: ctx.cartItems },
    		$$inline: true
    	});

    	function input1_input_handler() {
    		input1_updating = true;
    		ctx.input1_input_handler.call(input1);
    	}

    	var button = new Button({
    		props: {
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	},
    		$$inline: true
    	});
    	button.$on("click", ctx.createProduct);

    	var if_block_creators = [
    		create_if_block$1,
    		create_else_block$1
    	];

    	var if_blocks = [];

    	function select_block_type(changed, ctx) {
    		if (ctx.products.length === 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(null, ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			section0 = element("section");
    			navbar.$$.fragment.c();
    			t0 = space();
    			cart.$$.fragment.c();
    			t1 = space();
    			hr = element("hr");
    			t2 = space();
    			section1 = element("section");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Title";
    			t4 = space();
    			input0 = element("input");
    			t5 = space();
    			div1 = element("div");
    			label1 = element("label");
    			label1.textContent = "Price";
    			t7 = space();
    			input1 = element("input");
    			t8 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Description";
    			t10 = space();
    			textarea = element("textarea");
    			t11 = space();
    			button.$$.fragment.c();
    			t12 = space();
    			section2 = element("section");
    			if_block.c();
    			attr_dev(section0, "class", "svelte-xefyzg");
    			add_location(section0, file$5, 43, 0, 779);
    			add_location(hr, file$5, 47, 1, 842);
    			attr_dev(label0, "for", "title");
    			attr_dev(label0, "class", "svelte-xefyzg");
    			add_location(label0, file$5, 50, 2, 866);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "title");
    			input0.value = ctx.title;
    			attr_dev(input0, "class", "svelte-xefyzg");
    			add_location(input0, file$5, 51, 2, 901);
    			add_location(div0, file$5, 49, 1, 858);
    			attr_dev(label1, "for", "price");
    			attr_dev(label1, "class", "svelte-xefyzg");
    			add_location(label1, file$5, 55, 2, 990);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "id", "price");
    			attr_dev(input1, "class", "svelte-xefyzg");
    			add_location(input1, file$5, 56, 2, 1025);
    			add_location(div1, file$5, 54, 1, 982);
    			attr_dev(label2, "for", "description");
    			attr_dev(label2, "class", "svelte-xefyzg");
    			add_location(label2, file$5, 60, 2, 1099);
    			attr_dev(textarea, "rows", "3");
    			attr_dev(textarea, "id", "description");
    			attr_dev(textarea, "class", "svelte-xefyzg");
    			add_location(textarea, file$5, 61, 2, 1146);
    			add_location(div2, file$5, 59, 1, 1091);
    			attr_dev(section1, "class", "svelte-xefyzg");
    			add_location(section1, file$5, 48, 0, 847);
    			attr_dev(section2, "class", "svelte-xefyzg");
    			add_location(section2, file$5, 65, 0, 1290);

    			dispose = [
    				listen_dev(input0, "input", ctx.setTitle),
    				listen_dev(input1, "input", input1_input_handler),
    				listen_dev(textarea, "input", ctx.textarea_input_handler)
    			];
    		},

    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},

    		m: function mount(target, anchor) {
    			insert_dev(target, section0, anchor);
    			mount_component(navbar, section0, null);
    			append_dev(section0, t0);
    			mount_component(cart, section0, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t4);
    			append_dev(div0, input0);
    			append_dev(section1, t5);
    			append_dev(section1, div1);
    			append_dev(div1, label1);
    			append_dev(div1, t7);
    			append_dev(div1, input1);

    			set_input_value(input1, ctx.price);

    			append_dev(section1, t8);
    			append_dev(section1, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t10);
    			append_dev(div2, textarea);

    			set_input_value(textarea, ctx.description);

    			append_dev(section1, t11);
    			mount_component(button, section1, null);
    			insert_dev(target, t12, anchor);
    			insert_dev(target, section2, anchor);
    			if_blocks[current_block_type_index].m(section2, null);
    			current = true;
    		},

    		p: function update(changed, ctx) {
    			var cart_changes = {};
    			if (changed.cartItems) cart_changes.items = ctx.cartItems;
    			cart.$set(cart_changes);

    			if (!current || changed.title) {
    				prop_dev(input0, "value", ctx.title);
    			}

    			if (!input1_updating && changed.price) set_input_value(input1, ctx.price);
    			input1_updating = false;
    			if (changed.description) set_input_value(textarea, ctx.description);

    			var button_changes = {};
    			if (changed.$$scope) button_changes.$$scope = { changed, ctx };
    			button.$set(button_changes);

    			var previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(changed, ctx);
    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(changed, ctx);
    			} else {
    				group_outros();
    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});
    				check_outros();

    				if_block = if_blocks[current_block_type_index];
    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}
    				transition_in(if_block, 1);
    				if_block.m(section2, null);
    			}
    		},

    		i: function intro(local) {
    			if (current) return;
    			transition_in(navbar.$$.fragment, local);

    			transition_in(cart.$$.fragment, local);

    			transition_in(button.$$.fragment, local);

    			transition_in(if_block);
    			current = true;
    		},

    		o: function outro(local) {
    			transition_out(navbar.$$.fragment, local);
    			transition_out(cart.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},

    		d: function destroy(detaching) {
    			if (detaching) {
    				detach_dev(section0);
    			}

    			destroy_component(navbar);

    			destroy_component(cart);

    			if (detaching) {
    				detach_dev(t1);
    				detach_dev(hr);
    				detach_dev(t2);
    				detach_dev(section1);
    			}

    			destroy_component(button);

    			if (detaching) {
    				detach_dev(t12);
    				detach_dev(section2);
    			}

    			if_blocks[current_block_type_index].d();
    			run_all(dispose);
    		}
    	};
    	dispatch_dev("SvelteRegisterBlock", { block, id: create_fragment$5.name, type: "component", source: "", ctx });
    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	

    	let title = '';
    	let price = 0;
    	let description = '';

    	let products = [];
    	let cartItems = [];

    function setTitle(event) {
    	$$invalidate('title', title = event.target.value);
    }
    function createProduct() {
    	const newProduct = {
    		title: title,
    		price: price,
    		description: description
    	};
    	$$invalidate('products', products = products.concat(newProduct));
    }

    function addToCart(event) {
    	const selectedTitle = event.detail;
    	$$invalidate('cartItems', cartItems = cartItems.concat(
    		{...products.find(prod => prod.title === selectedTitle)}));
    		console.log(cartItems);
    }

    	function input1_input_handler() {
    		price = to_number(this.value);
    		$$invalidate('price', price);
    	}

    	function textarea_input_handler() {
    		description = this.value;
    		$$invalidate('description', description);
    	}

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate('title', title = $$props.title);
    		if ('price' in $$props) $$invalidate('price', price = $$props.price);
    		if ('description' in $$props) $$invalidate('description', description = $$props.description);
    		if ('products' in $$props) $$invalidate('products', products = $$props.products);
    		if ('cartItems' in $$props) $$invalidate('cartItems', cartItems = $$props.cartItems);
    	};

    	return {
    		title,
    		price,
    		description,
    		products,
    		cartItems,
    		setTitle,
    		createProduct,
    		addToCart,
    		input1_input_handler,
    		textarea_input_handler
    	};
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$5, safe_not_equal, []);
    		dispatch_dev("SvelteRegisterComponent", { component: this, tagName: "App", options, id: create_fragment$5.name });
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
