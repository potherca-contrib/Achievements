# Dealer Direct Achievements

## Introduction

This repository contains the code, templates and data that help us track the progress
of Dealer Direct achievements. These achievements are represented by "badges" that 
people can reward each other with.

For the Developers, the person who has been awarded the most badges at the end of a sprint "wins" that sprint.

## Usage

### Rewarding Badges

In order to reward someone with a badge, a pull request must be opened. To do this,
a Github account is required. If you do not have one, you can always ask on of the
colleagues that does.

Follow these steps to reward someone with a badge:

1. Visit the [DealerDirect Achievements Repository](https://github.com/DealerDirect/Achievements/)
2. Find the file of the person that is to be rewarded a badge in the `_profiles` directory
3. Click on the file name to view the contents of that file
4. Click on the little pencil icon (on the right). This will open a page on which the file can be edited.
5. In the file, find the name of the icon the person is to be awarded.
6. Increment the number behind the badge name. (So if it is `0`, change it to `1`. If it is `3`, change it to `4`).
7. At the bottom of the page, add the reason why this person should be awarded this badge. Add more details if needed.
8. Make sure the option " Create a **new branch** for this commit and start a pull request." is selected.
9. Press the <kbd>Commit Changes</kbd> button

This will open a pull request. If at least one other employees supports your reward, it can be merged.

The award will show up on the persons profile page.

### Adding a new user

In order to add an employee to this repository, information and files need to be added.

#### Add the employee to a departement

The first step is to add an employee by editing the `_data/members.json` file.

This file has the following structure: 

```
{
  "departments": [
    {
      "name": "Departement Name",
      "members": [
        {
          "name": "Name",
          "fullname" : "Name of Employee",
          "initials" : "N.E."
        }
      ]
    }
  ]
}
```

An employee can be added to an existing departement or a new departement can be added.

#### Add a profile

After this a file needs to be created to the `_profiles/` directory. The name of this
file _must_ be _exactly_ the same as the employees name (as placed in the members.json file),
in lowercase with all spaces replaced by dashes '-'.

An empty file is available as example (the `empty.md` file). This file can be copied for a new employee.

#### Add an avatar

Finally an image (a so called _avatar_) can be added for an employee. Such a file
should be placed in the `img/avatars/svg/` directory. It should also be an SVG file.
The file _must_ adhere to the naming convention mentioned above.

An avatar file is optional. Of none is provided, the persons initials will be displayed,
with a background color based on their initials.

## Technical details

### Enforcement

In order to validate that at least one other developer supports a badge being awarded, the [LGTM service](https://lgtm.co/)
is used as github service hook.

The LGTM configuration (which can be found in the `.lgtm` file) is set so that _at least_ one other developer approves
 by adding one of the following to the comments of a pull-request:

 - :shipit:
 - :+1:
 - Agree / agree
 - okay / Okay / OK

## License

The code in this repository is released under the [GPLv3 license](LICENSE).
