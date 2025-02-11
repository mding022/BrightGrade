
# BrightGrade

Chrome extension to give an accurate calculation of your current grade in a Brightspace class. It works by taking into account weighted points and allows the user to put an estimate as to what they think they will achieve in their pending grades.

Note: The application assumes all marks with a 0 mark or dash are pending and assumes the student cannot get a 0 mark.
## Demo

After successfully loading the extension, you should be able to run it in any Chrome-based browser.

![MainUI](https://github.com/mding022/BrightGrade/blob/be1133aec232cf38e663bee3bd4061893f6baad4/screenshots/ui.png?raw=true)

After navigating to any course page's "Grades" page, you can press the "Get Grades" button to extract your progress in the course.

![Grades](https://github.com/mding022/BrightGrade/blob/be1133aec232cf38e663bee3bd4061893f6baad4/screenshots/grades.png?raw=true)

You can also use the slider to adjust what your expected pending grades will be. For example, if I assumed I will get a 40% average in my future assignments and examinations:

![Example](https://github.com/mding022/BrightGrade/blob/be1133aec232cf38e663bee3bd4061893f6baad4/screenshots/projection.png?raw=true)

Since this is a work in progress, some Brightspace courses with a special grading system (letter grading only, etc.) may be buggy.


## Installation

You can install this by downloading this repo and going to the chrome extensions manager, enabling developer mode, and then selecting this folder in the "Load Unpacked" selector.

[Guide on installing unpacked chrome extensions.](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/)

