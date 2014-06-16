test-express-dtrace
===================

Demo: porting an Express 3.x app to Express 4.x and using DTrace niceties.

slides: [dtrace para flipar pepinillos](https://slides.com/guidogarcia/dtrace)

Tags
----

You can git checkout to any of these tags:
- **step/1**: create a basic Express 3.x app
- **step/2**: create a "bubbles" web app with Express 3.x
- **step/3**: migrate "bubbles" to Express 4.x
- **step/dtrace**: declare dtrace probes

If you reach the step/dtrace tag, you'll need a system that supports dtrace (OSX, Solaris/SmartOS, BSD).

Some examples:
```
dtrace -n 'bubble-end { trace("new bubble") }'
dtrace -n 'bubble-start { printf("color %s", copyinstr(arg0)); }'
dtrace -n 'bubble-start { @[copyinstr(arg0)] = count() } tick-5s { printa(@) }'
```
