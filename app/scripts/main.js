"use strict";
var React                   = require('react');
var d3                      = require('d3');

var BarChart                = require('./../../lib/BarChart');
var DonutChart              = require('./../../lib/DonutChart');
var BarChart                = require('./../../lib/BarChart');
var LineChart               = require('./../../lib/LineChart');
var HorizontalBarChart      = require('./../../lib/HorizontalBarChart');
var StackedAreaChart        = require('./../../lib/StackedAreaChart');

var Charts = React.createClass({
    getInitialState: function(){
        return {
            data: [],
            donutData: [],
            value: 'value'
        };
    },
    changeDonutData: function(){
        var donutData = [
            {
                name: 'Lucia',
                value: getRandomInt(1,200)
            },
            {
                name: 'Christian',
                value: getRandomInt(1,200)
            },
            {
                name: 'Luis',
                value: getRandomInt(1,200)
            }
        ];
        var sample = getRandomInt(1,50);
        console.log(sample);
        if(sample % 2 === 0){
            donutData.push({
                name: 'Miguel',
                value: getRandomInt(1,200)
            });
        }
        this.setState({
            donutData: donutData
        });
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    },
    removeDonutData: function(){
        this.setState({
            donutData: []
        });
    },
    changeData: function(){
        var totalArrays = [];
        var data = [];
        var size = 100;
        var i = 0;
        var j = 0;
        var numLines = 5;
        var tempArray = [];
        var neg = 1;

        while(numLines--) {
            while(i < size) {
                neg = neg * (-1);
                data.push({
                    name: String.fromCharCode(97 + i),
                    date: new Date(2012,1,(i+1)),
                    value: getRandomInt(0, 100),
                    ratio: getRandomInt(0, 1010000)
                });
                i++;
            }
            totalArrays.push(data);
            data = [];
            i = 0;
        }
        var neg = -1;
        if(size % 2 === 0){
            neg = 1;
        }
        data.push({
            name: size + '',
            date: new Date(2012,1,size),
            value: getRandomInt(0, 100) * neg,
            ratio: getRandomInt(0, 1010000) * neg
        });

        this.setState({
          dataLine: totalArrays,
          dataBar: data,
        });
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        function randomDate(start, end) {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        }  
    },
    emptyData: function(){
        this.setState({
            dataLine: [],
            dataBar: [],
        });
    },
    exportToPNG: function(){
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        canvg('canvas', $('#bar-chart-strahc').html());
        // the canvas calls to output a png
        var img = canvas.toDataURL("image/jpeg");
        var swapped = img.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        var element = document.createElement('a');
        element.setAttribute('href', swapped);
        element.setAttribute('download', 'chart.jpeg');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
    legendFormatter: function(d){
        var strBuffer = '';
        strBuffer += '<h4>' + d.data.name + '</h4>';
        strBuffer += '<hr/>';
        strBuffer += '<h4>' + d.data.value + '</h4>';
        strBuffer += '<h5>' + 'I can show any data' + '</h5>';
        strBuffer += '<p style="font-size:10px">' + 'The missing elements are added to the SVG container by calling selection.append on the enter selection. This appends a new circle for each data point.' + '</p>';
        return strBuffer;
    },
    render: function(){
        var megaColors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
        var xAxis = {
            rotate: -20,
            anchor: 'end',
            // format: d3.time.format("%Y-%m-%d")
        };
        var margin = {
            top: 20,
            bottom: 60,
            left: 50,
            right: 20
        };
        var donutColors = { 
            'Lucia':        '#d94801',
            'Christian':    '#a63603',
            'Luis':         '#7f2704',
            'Miguel':       '#FF7835'
        };
        var donutData = [
            {
                name: 'Lucia',
                value: 25
            },
            {
                name: 'Christian',
                value: 204
            },
            {
                name: 'Luis',
                value: 20
            }
        ];
        return(
            <div className='col-sm-12'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <FillerHTML/>
                    </div>
                    <div className='col-sm-3'>
                        <h4>Donut Chart</h4>
                        <DonutChart
                            thickness={25}
                            tooltip={false}
                            data={this.state.donutData}
                            colors={donutColors}
                            legendFormatter={this.legendFormatter}/>
                        <button onClick={this.changeDonutData} className="btn btn-warning" type="submit">Load Data</button>
                        <button onClick={this.removeDonutData} className="btn btn-danger" type="submit">Remove Data</button>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-sm-6'>
                        <h4>Bar Chart</h4>
                        <StackedAreaChart
                            scale='time'
                            height={400}
                            colors={megaColors}
                            xAxis={xAxis}
                            margin={margin}
                            divisions={[0,45,-30]}
                            valueKey='date'
                            data={this.state.dataLine}/>
                        <hr/>
                        <button onClick={this.changeData} className="btn btn-warning" type="submit">Load Data</button>
                        <button onClick={this.emptyData} className="btn btn-danger" type="submit">Remove Data</button>
                    </div>
                    <div className='col-sm-6'>
                        <h4>Using the component:</h4>
                        <code>
                            &lt;StackedAreaChart
                                height=&#123;400&#125;
                                colors=&#123;["#1abc9c", "#2ecc71", "#3498db"]&#125;
                                xAxis=&#123;xAxis&#125;
                                margin=&#123;margin&#125;
                                divisions=&#123;[0,45,-30]&#125;
                                valueKey='name'
                                data=&#123;data&#125;/&gt;
                        </code>
                        <p>Whenever this code is run, it recomputes the data join and maintains the desired correspondence between elements and data. If the new dataset is smaller than the old one, the surplus elements end up in the <i>exit</i> selection and get removed. If the new dataset is larger, the surplus data ends up in the <i>enter</i> selection and new nodes are added. If the new dataset is exactly the same size, then all the elements are simply updated with new positions, and no elements are added or removed.</p>
                        <p>Thinking with joins means your code is more <i>declarative</i>: you handle these three states without any branching (<code class="javascript"><span class="keyword">if</span></code>) or iteration (<code class="javascript"><span class="keyword">for</span></code>). Instead you describe how elements should correspond to data. If a given <i>enter</i>, <i>update</i> or <i>exit</i> selection happens to be empty, the corresponding code is a no-op.</p>
                        <p>Joins also let you target operations to specific states, if needed. For example, you can set constant attributes (such as the circle’s radius, defined by the <code class="javascript"><span class="string">"r"</span></code> attribute) on enter rather than update. By reselecting elements and minimizing DOM changes, you vastly improve rendering performance! Similarly, you can target animated transitions to specific states. For example, for entering circles to expand-in:</p>
                        <ol>
                            <li>
                                <p>First, <code class="javascript">svg.selectAll(<span class="string">"circle"</span>)</code> returns a new empty selection, since the SVG container was empty. The parent node of this selection is the SVG container.
                                </p>
                            </li>
                            <li>
                                <p>This selection is then joined to an array of data, resulting in three new selections that represent the three possible states: <i>enter</i>, <i>update</i>, and <i>exit</i>. Since the selection was empty, the update and exit selections are empty, while the enter selection contains a placeholder for each new datum.
                                </p>
                            </li>
                            <li>
                                <p>The update selection is returned by <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-data">selection.data</a>, while the enter and exit selections hang off the update selection; <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-enter">selection.enter</a> thus returns the enter selection.
                                </p>
                            </li>
                            <li>
                                <p>The missing elements are added to the SVG container by calling <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-append">selection.append</a> on the enter selection. This appends a new circle for each data point to the SVG container.
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
{/*}
                <div className='row'>
                    <div className='col-sm-6'>
                        <h4>Bar Chart</h4>
                        <LineChart
                            areaChart={false}
                            scale='time'
                            height={400}
                            colors={megaColors}
                            xAxis={xAxis}
                            margin={margin}
                            divisions={[0,45,-30]}
                            valueKey='date'
                            data={this.state.dataLine}/>
                        <hr/>
                        <button onClick={this.changeData} className="btn btn-warning" type="submit">Load Data</button>
                        <button onClick={this.emptyData} className="btn btn-danger" type="submit">Remove Data</button>
                    </div>
                    <div className='col-sm-6'>
                        <h4>Using the component:</h4>
                        <code>
                            &lt;LineChart
                                height=&#123;400&#125;
                                colors=&#123;["#1abc9c", "#2ecc71", "#3498db"]&#125;
                                xAxis=&#123;xAxis&#125;
                                margin=&#123;margin&#125;
                                divisions=&#123;[0,45,-30]&#125;
                                valueKey='name'
                                data=&#123;data&#125;/&gt;
                        </code>
                        <p>Whenever this code is run, it recomputes the data join and maintains the desired correspondence between elements and data. If the new dataset is smaller than the old one, the surplus elements end up in the <i>exit</i> selection and get removed. If the new dataset is larger, the surplus data ends up in the <i>enter</i> selection and new nodes are added. If the new dataset is exactly the same size, then all the elements are simply updated with new positions, and no elements are added or removed.</p>
                        <p>Thinking with joins means your code is more <i>declarative</i>: you handle these three states without any branching (<code class="javascript"><span class="keyword">if</span></code>) or iteration (<code class="javascript"><span class="keyword">for</span></code>). Instead you describe how elements should correspond to data. If a given <i>enter</i>, <i>update</i> or <i>exit</i> selection happens to be empty, the corresponding code is a no-op.</p>
                        <p>Joins also let you target operations to specific states, if needed. For example, you can set constant attributes (such as the circle’s radius, defined by the <code class="javascript"><span class="string">"r"</span></code> attribute) on enter rather than update. By reselecting elements and minimizing DOM changes, you vastly improve rendering performance! Similarly, you can target animated transitions to specific states. For example, for entering circles to expand-in:</p>
                        <ol>
                            <li>
                                <p>First, <code class="javascript">svg.selectAll(<span class="string">"circle"</span>)</code> returns a new empty selection, since the SVG container was empty. The parent node of this selection is the SVG container.
                                </p>
                            </li>
                            <li>
                                <p>This selection is then joined to an array of data, resulting in three new selections that represent the three possible states: <i>enter</i>, <i>update</i>, and <i>exit</i>. Since the selection was empty, the update and exit selections are empty, while the enter selection contains a placeholder for each new datum.
                                </p>
                            </li>
                            <li>
                                <p>The update selection is returned by <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-data">selection.data</a>, while the enter and exit selections hang off the update selection; <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-enter">selection.enter</a> thus returns the enter selection.
                                </p>
                            </li>
                            <li>
                                <p>The missing elements are added to the SVG container by calling <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-append">selection.append</a> on the enter selection. This appends a new circle for each data point to the SVG container.
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
                */}
                {/*
                <div className='row'>
                    <div className='col-sm-6'>
                        <h4>Bar Chart</h4>
                        <HorizontalBarChart
                            scale='linear'
                            height={400}
                            color={'#ec971f'}
                            colors={megaColors}
                            xAxis={xAxis}
                            margin={margin}
                            divisions={[0,45,-30]}
                            valueKey='name'
                            data={this.state.dataBar}/>
                        <hr/>
                        <button onClick={this.changeData} className="btn btn-warning" type="submit">Load Data</button>
                        <button onClick={this.emptyData} className="btn btn-danger" type="submit">Remove Data</button>
                    </div>
                    <div className='col-sm-6'>
                        <h4>Using the component:</h4>
                        <code>
                            &lt;HorizontalBarChart
                                height=&#123;400&#125;
                                color=&#123;'#ec971f'&#125;
                                xAxis=&#123;xAxis&#125;
                                margin=&#123;margin&#125;
                                divisions=&#123;[0,45,-30]&#125;
                                valueKey='name'
                                data=&#123;data&#125;/&gt;
                        </code>
                        <p>Whenever this code is run, it recomputes the data join and maintains the desired correspondence between elements and data. If the new dataset is smaller than the old one, the surplus elements end up in the <i>exit</i> selection and get removed. If the new dataset is larger, the surplus data ends up in the <i>enter</i> selection and new nodes are added. If the new dataset is exactly the same size, then all the elements are simply updated with new positions, and no elements are added or removed.</p>
                        <p>Thinking with joins means your code is more <i>declarative</i>: you handle these three states without any branching (<code class="javascript"><span class="keyword">if</span></code>) or iteration (<code class="javascript"><span class="keyword">for</span></code>). Instead you describe how elements should correspond to data. If a given <i>enter</i>, <i>update</i> or <i>exit</i> selection happens to be empty, the corresponding code is a no-op.</p>
                        <p>Joins also let you target operations to specific states, if needed. For example, you can set constant attributes (such as the circle’s radius, defined by the <code class="javascript"><span class="string">"r"</span></code> attribute) on enter rather than update. By reselecting elements and minimizing DOM changes, you vastly improve rendering performance! Similarly, you can target animated transitions to specific states. For example, for entering circles to expand-in:</p>
                        <ol>
                            <li>
                                <p>First, <code class="javascript">svg.selectAll(<span class="string">"circle"</span>)</code> returns a new empty selection, since the SVG container was empty. The parent node of this selection is the SVG container.
                                </p>
                            </li>
                            <li>
                                <p>This selection is then joined to an array of data, resulting in three new selections that represent the three possible states: <i>enter</i>, <i>update</i>, and <i>exit</i>. Since the selection was empty, the update and exit selections are empty, while the enter selection contains a placeholder for each new datum.
                                </p>
                            </li>
                            <li>
                                <p>The update selection is returned by <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-data">selection.data</a>, while the enter and exit selections hang off the update selection; <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-enter">selection.enter</a> thus returns the enter selection.
                                </p>
                            </li>
                            <li>
                                <p>The missing elements are added to the SVG container by calling <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-append">selection.append</a> on the enter selection. This appends a new circle for each data point to the SVG container.
                                </p>
                            </li>
                        </ol>
                    </div>
                </div>
                */}
            </div>
        );
    }
});

var FillerHTML = React.createClass({
    render: function(){
        return(
            <div>
                <h4>Using the component:</h4>
                <pre>
                    &lt;BarChart
                    height=&#123;400&#125;
                    color=&#123;'#ec971f'&#125;
                    xAxis=&#123;xAxis&#125;
                    margin=&#123;margin&#125;
                    divisions=&#123;[0,45,-30]&#125;
                    valueKey='name'
                    data=&#123;data&#125;/&gt;
                </pre>
                <p>Whenever this code is run, it recomputes the data join and maintains the desired correspondence between elements and data. If the new dataset is smaller than the old one, the surplus elements end up in the <i>exit</i> selection and get removed. If the new dataset is larger, the surplus data ends up in the <i>enter</i> selection and new nodes are added. If the new dataset is exactly the same size, then all the elements are simply updated with new positions, and no elements are added or removed.</p>
                <p>Thinking with joins means your code is more <i>declarative</i>: you handle these three states without any branching (<code class="javascript"><span class="keyword">if</span></code>) or iteration (<code class="javascript"><span class="keyword">for</span></code>). Instead you describe how elements should correspond to data. If a given <i>enter</i>, <i>update</i> or <i>exit</i> selection happens to be empty, the corresponding code is a no-op.</p>
                <p>Joins also let you target operations to specific states, if needed. For example, you can set constant attributes (such as the circle’s radius, defined by the <code class="javascript"><span class="string">"r"</span></code> attribute) on enter rather than update. By reselecting elements and minimizing DOM changes, you vastly improve rendering performance! Similarly, you can target animated transitions to specific states. For example, for entering circles to expand-in:</p>
                <ol>
                    <li>
                        <p>First, <code class="javascript">svg.selectAll(<span class="string">"circle"</span>)</code> returns a new empty selection, since the SVG container was empty. The parent node of this selection is the SVG container.
                            </p>
                        </li>
                        <li>
                            <p>This selection is then joined to an array of data, resulting in three new selections that represent the three possible states: <i>enter</i>, <i>update</i>, and <i>exit</i>. Since the selection was empty, the update and exit selections are empty, while the enter selection contains a placeholder for each new datum.
                                    </p>
                                </li>
                                <li>
                                    <p>The update selection is returned by <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-data">selection.data</a>, while the enter and exit selections hang off the update selection; <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-enter">selection.enter</a> thus returns the enter selection.
                                    </p>
                                </li>
                                <li>
                                    <p>The missing elements are added to the SVG container by calling <a href="https://github.com/mbostock/d3/wiki/Selections#wiki-append">selection.append</a> on the enter selection. This appends a new circle for each data point to the SVG container.
                                        </p>
                                    </li>
                                </ol>

                            </div>
        );
    }
});
React.render(<Charts/>, document.getElementById('react-strahc'));
