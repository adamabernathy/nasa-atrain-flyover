## Read Me

* Parses telemetry data from textarea into object with time, lat, long,
  and heading.

* Uses telemetry data to generate Polyline along flight path

### Issues
- Polyline is less than ideal bc it isn't aware of multiple passes
  through a geo region. The line looks like one continuous movement when
  it clearly is not. Unless we're actually tracking UFO's.

  __This issue can be solved by the user not providing the second half
  of the flyover. Ideally we would add a feature to only take the
  daytime values. This could be calculated by only accepting GMT times
  that are 0:12L. To fully solve this, problem the user would need to
  specify the day/night orbit and then we would need to convert the
  GMT string to a time object (or use Julian time) to make the time
  calculation.__


### TODO
- [ ]  Get coords plotted to markers rather than a polyline.

- [ ]  Compile an optimized version of Bootstrap.

- [ ] Fix footer formatting in CSS.

---

- [x] Update table with new set of coords and corresponding markers.

- [x] Clean up file organization.


### Nice to haves
* Track telemetry data separately for each approach (am and pm movement)
- Discussed earlier.

* Plot out intersection points with areas on map accessible via driving
  directions.
