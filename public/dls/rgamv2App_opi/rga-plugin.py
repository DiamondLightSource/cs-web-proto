#!/usr/bin/env python

"""
rga-plugin.py

A Pirani gauge widget custom widget plugin for Qt Designer.

"""

from PyQt4 import QtGui, QtDesigner
from rgawidget import RgaWidget


class RgaPlugin(QtDesigner.QPyDesignerCustomWidgetPlugin):

    """RgaPlugin(QtDesigner.QPyDesignerCustomWidgetPlugin)
    
    """
    
    # The __init__() method is only used to set up the plugin and define its
    # initialized variable.
    def __init__(self, parent = None):
    
        QtDesigner.QPyDesignerCustomWidgetPlugin.__init__(self)

        self.initialized = False

    # The initialize() and isInitialized() methods allow the plugin to set up
    # any required resources, ensuring that this can only happen once for each
    # plugin.
    def initialize(self, core):

        if self.initialized:
            return

        self.initialized = True

    def isInitialized(self):

        return self.initialized

    # This factory method creates new instances of our custom widget with the
    # appropriate parent.
    def createWidget(self, parent):

        return RgaWidget(parent)

    # This method returns the name of the custom widget class that is provided
    # by this plugin.
    def name(self):

        return "RgaWidget"

    # Returns the name of the group in Qt Designer's widget box that this
    # widget belongs to.
    def group(self):

        return "Diamond Widgets"

    # Returns the icon used to represent the custom widget in Qt Designer's
    # widget box.
    def icon(self):

        return QtGui.QIcon(_logo_pixmap)

    # Returns a short description of the custom widget for use in a tool tip.
    def toolTip(self):

        return ""

    # Returns a short description of the custom widget for use in a "What's
    # This?" help message for the widget.
    def whatsThis(self):

        return ""

    # Returns True if the custom widget acts as a container for other widgets;
    # otherwise returns False. Note that plugins for custom containers also
    # need to provide an implementation of the QDesignerContainerExtension
    # interface if they need to add custom editing support to Qt Designer.
    def isContainer(self):

        return False

    # Returns an XML description of a custom widget instance that describes
    # default values for its properties. Each custom widget created by this
    # plugin will be configured using this description.
    def domXml(self):

        return (
               '<widget class="RgaWidget" name=\"RgaWidget\">\n'
               " <property name=\"toolTip\" >\n"
               "  <string>Click and drag here</string>\n"
               " </property>\n"
               " <property name=\"whatsThis\" >\n"
               "  <string>The Rga widget displays an RGA"
               "</string>\n"
               " </property>\n"
               "</widget>\n"
               )

    # Returns the module containing the custom widget class. It may include
    # a module path.
    def includeFile(self):

        return "rgawidget"


# Define the image used for the icon.
# Define the image used for the icon.
_logo_16x16_xpm = [
"51 52 88 2",
".f c #000000",
"#u c #808080",
"#t c #858585",
"#q c #878787",
"#p c #898989",
"#o c #8a8a8a",
"#e c #8b8b8b",
"#b c #8c8c8c",
"#a c #8d8d8d",
"#. c #979797",
"#k c #9d9d9d",
".p c #9e9e9e",
"#l c #a1a1a1",
".h c #a2a2a2",
".o c #a3a3a3",
".q c #a6a6a6",
".L c #a7a7a7",
".I c #a8a8a8",
".A c #a9a9a9",
".Z c #ababab",
".i c #adadad",
".x c #aeaeae",
".9 c #afafaf",
".w c #b1b1b1",
".7 c #b2b2b2",
".Y c #b3b3b3",
".5 c #b4b4b4",
".4 c #b5b5b5",
"#m c #b6b6b6",
".j c #b7b7b7",
".l c #b8b8b8",
".r c #b9b9b9",
"#g c #bababa",
".k c #bbbbbb",
".F c #bcbcbc",
".v c #bdbdbd",
".Q c #bebebe",
".T c #bfbfbf",
".S c #c0c0c0",
".N c #c1c1c1",
".O c #c2c2c2",
".B c #c3c3c3",
".1 c #c4c4c4",
".0 c #c5c5c5",
"#c c #c8c8c8",
".s c #c9c9c9",
"#r c #cbcbcb",
".J c #cdcdcd",
".t c #cecece",
".u c #cfcfcf",
"#i c #d0d0d0",
".6 c #d1d1d1",
"#s c #d2d2d2",
".E c #d3d3d3",
"## c #d4d4d4",
".8 c #d5d5d5",
"#v c #d8d8d8",
".2 c #d9d9d9",
".R c #dadada",
".G c #dbdbdb",
".U c #dddddd",
".P c #dedede",
".C c #dfdfdf",
".M c #e0e0e0",
".m c #e1e1e1",
".3 c #e2e2e2",
".y c #e3e3e3",
".V c #e4e4e4",
"#d c #e5e5e5",
"#f c #eaeaea",
".g c #ebebeb",
"#n c #ececec",
".H c #ededed",
".n c #eeeeee",
".X c #efefef",
".b c #f0f0f0",
"#j c #f1f1f1",
".c c #f2f2f2",
".z c #f3f3f3",
".K c #f4f4f4",
"#h c #f7f7f7",
".d c #f8f8f8",
".W c #fbfbfb",
".e c #fcfcfc",
".a c #fdfdfd",
".# c #fefefe",
".D c #fffffd",
"Qt c #ffffff",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt.#.a.a.a.a.a.a.a.a.a.a.a.a.#QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt.#QtQtQtQtQtQtQtQtQtQtQtQtQt.b.c.d.e.a.#QtQtQtQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQt.#QtQtQt.f.f.f.f.f.f.f.f.f.f.f.f.fQtQt.g.c.d.e.#QtQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQt.#QtQtQt.f.f.f.f.h.i.j.k.k.k.k.k.k.l.f.f.f.fQt.m.n.d.aQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQt.f.f.f.i.o.p.q.r.s.t.u.u.u.u.t.s.v.w.x.f.f.f.u.y.z.e.#QtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQt.f.f.f.i.A.i.l.B.u.C.D.D.D.D.D.D.D.D.m.E.s.F.x.f.fQt.G.H.d.aQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQt.f.f.i.I.i.F.t.C.D.D.D.D.D.D.D.D.D.D.D.D.D.D.C.J.r.f.f.f.t.y.K.aQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQt.f.f.I.L.r.J.M.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.G.N.i.f.f.O.P.z.eQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQt.f.f.L.L.Q.R.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.y.t.r.f.f.S.P.K.aQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQt.f.f.L.L.T.U.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.R.Q.f.f.O.V.d.#QtQtQtQtQt",
"QtQtQtQtQt.#Qt.f.f.A.L.T.U.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.UQt.f.i.u.H.WQtQtQtQtQt",
"QtQtQtQtQtQt.X.f.Y.Z.S.U.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.R.f.f.r.G.z.aQtQtQtQt",
"QtQtQtQtQtQt.f.0.j.1.P.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.t.f.f.O.y.d.#QtQtQt",
"QtQtQt.#Qt.f.f.l.1.P.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.2.D.D.3Qt.f.i.u.n.eQtQtQt",
"QtQtQt.aQt.f.4.5.6.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.7.8.D.D.G.f.f.v.m.d.#QtQt",
"QtQtQtQtQt.f.9.v.M.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f#..0.D.D.D.D.f.w##.c.aQtQt",
"QtQt.#Qt.f.f.9.s.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f#a.S.D.D.D.m.f.5.J.H.WQtQt",
"QtQt.aQt.f.w.w.E.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f#b.T.D.D.D.D.D.f#c#d.d.#Qt",
"QtQtQtQt.f.x.v.M.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.O.R.z.aQt",
"Qt.#Qt.f.f.x.s.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.2.D.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.v.6.b.aQt",
"Qt.aQt.f.7.w.E.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.7.8.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.j.s#f.WQt",
"Qt.aQt.f.7.v.m.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f#..0.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.f#g.C#h.#",
"Qt.aQt.f.l.s.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f#a.S.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.f.q#i#j.a",
"Qt.aQt.f.k.t.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f#b.T.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.f#k#c.n.a",
"Qt.aQt.f.k.u.D.D.D.D.D.D.D.f.f.2.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.f#k.0.H.a",
"Qt.aQt.f.k.u.D.D.D.D.D.D.D.f.f.7.8.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.f#k#c.n.a",
"Qt.aQt.f.k.t.D.D.D.D.D.D.D.f.f#..0.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f#l.q#i#j.a",
"Qt.aQt.f.l.s.D.D.D.D.D.D.D.f.f#a.S.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.i.r.C#h.#",
"Qt.a.X.f.f.v.m.D.D.D.D.D.D.f.f#b.T.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f#m.s#f.WQt",
"Qt.a.cQt.f.7.8.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.f.j.J.n.aQt",
"Qt.##hQt.f.7.t.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.f.f.7.t.X.aQt",
"QtQt.W#n.f#g.J.D.D.D.D.D.D.f.f#o.v.D.D.D.D.D.D.D.f.f#o.v.D.D.D.D.D.D.D.D.f.f#e.Q.D.D.D.D.f.7.7.8.c.aQt",
"QtQt.a.cQt.f.s.V.D.D.D.D.D.f.f.D.D.D.D.D.D.D.D.D.f.f.D.D.D.D.D.D.D.D.D.D.f.f#p.Q.D.D.D.D.f.5.N.m.d.#Qt",
"QtQt.#.dQt.f.Q##.D.D.D.D.D.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f#q.Q.D.D.D.f.s.T##.X.eQtQt",
"QtQtQt.W.H.f.f.N.m.D.D.D.D.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f.f#e.B.D.D.D.f.1#r#d.d.#QtQt",
"QtQtQt.a.c.8.f.4#s.D.D.D.D#s.L#e#q#p#e#e#e#e#e#p#t#u#u#t#p#e#e#e#e#e#e#p#q#e.q#s.D.D.f#c.B#v.b.eQtQtQt",
"QtQtQt.#.d#dQt.f.1.C.D.D.D.D#s.B.Q.Q.Q.Q.Q.Q.Q.Q.v.v.v.v.Q.Q.Q.Q.Q.Q.Q.Q.Q.B#s.D.D.f.f.r#c#d.d.#QtQtQt",
"QtQtQtQt.a.K.C.f.f.1.C.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.Z.Y.E.b.eQtQtQtQt",
"QtQtQtQtQt.W.n#s.f.f.S.P.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.L.I.B.V.d.#QtQtQtQt",
"QtQtQtQtQt.#.d.V.B.f.f.T.P.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.L.L.T.P.K.aQtQtQtQtQt",
"QtQtQtQtQtQt.a.K.P.S.f.f.T.U.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.L.L.T.U.z.eQtQtQtQtQtQt",
"QtQtQtQtQtQtQt.e.z.U.T.f.fQt.R.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.L.L.T.U.z.eQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQt.e.z.U.T.f.f.f.D.M.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.f.L.I.T.U.z.eQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQt.e.z.P.O.i.f.f.f.D.D.D.D.D.D.D.D.D.D.D.D.D.D.D.f.f.f.i.I.i.O.P.z.eQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQt.e.K.y.u.F.i.f.f.f.f.D.D.D.D.D.D.D.D.D.f.f.f.f.x.A.i.F.u.y.K.eQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQt.a.d.n.M.t.v.w.x.f.f.f.f.f.f.f.f.f.f.f.w.x.x.w.v.t.M.n.d.aQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQt.#.e#h.n.m.E.s.v.7.7.l.k.k.k.k.k.l.7.w.v.s.E.m.n#h.e.#QtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQt.#.e.d.c.g.m##.t.t.u.u.u.u.u.t.t##.m.g.c.d.e.#QtQtQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt.#.a.e.d.c.b.X.n.n.n.n.n.X.b.c.d.e.a.#QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt",
"QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt.#.a.a.a.a.a.a.a.a.a.a.a.#QtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQtQt"]


_logo_pixmap = QtGui.QPixmap(_logo_16x16_xpm)
