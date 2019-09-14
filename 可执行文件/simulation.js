/*******按要求产生一个地址流数组，并将其转换为页号流数组*******/
/*
 *算法思路：
 *
 */
var addressArr, pageArr;
function random() {
    addressArr = [];
    var randomNum;
    for(let i = 0; i < 100; i++) { //将数组按要求填满400个数
        randomNum = Math.floor(Math.random() * 200); //随机生成一个[0,200)之间的整数
        addressArr.push(randomNum); //将m推进队列里
        if(randomNum == 199) { //如果是199，则加1就溢出了
            addressArr.push(0); //将0推进队列里
        } else {
            addressArr.push(randomNum + 1); //将m+1推进队列里
        }
        randomNum = Math.floor(Math.random() * 200 + 200); //随机生成一个[200,400)之间的整数
        addressArr.push(randomNum); //将m’推进队列里
        if(randomNum == 399) { //如果是399，则加1就溢出了
            addressArr.push(200); //将200推进队列里
        } else {
            addressArr.push(randomNum + 1); //将m’+1推进队列里
        }
    }
    pageArr = addressArr.map(
        function(x) {
            return(Math.floor(x / 10));
        }
    );
}

function replace() {
    for(let k = 4; k <= 40; k++) {
        var fifoArr = [], lruArr = [], optArr = []; //页框数组
        var num2 = 0, num3 = 0, num4 = 0; //缺页次数
        /******fifo******/
        for(let i = 0; i < pageArr.length; i++){
            if(fifoArr.length < k){ //页框初始化
                if((fifoArr.indexOf(pageArr[i])) == -1){ //若页框数组里没有该页号了，则加入
                    fifoArr.push(pageArr[i]); //进队列
                } else { //若页框数组里有该页号了，则不用再加入了，循环页地址流中的下一个页号
                    continue;
                }
            } else { //页框初始化后
                if((fifoArr.indexOf(pageArr[i])) != -1){ //若页框数组里有该页号了，则循环页地址流中的下一个页号
                    continue;
                } else { //若页框数组里没有该页号，则删掉第一个元素（因为它最早进来），再从后面插入一个元素
                    fifoArr.shift(); //出队列
                    fifoArr.push(pageArr[i]); //进队列
                    num2++; //同时缺页数加1
                }
            }
        }

        /*****lru******/
        for(let i = 0; i < pageArr.length; i++) { //循环页地址流数组
            if(lruArr.length < k) { //页框初始化时
                if((lruArr.indexOf(pageArr[i])) == -1) { //页框队列里的元素都不与页地址流的页号不重复时
                    lruArr.push(pageArr[i]); //新的页号直接插入页框队列尾部
                } else { //页框队列里有元素与页地址流的页号重复时，将该页号调出插到队列尾
                    lruArr.splice(lruArr.indexOf(pageArr[i]), 1); //删除该元素
                    lruArr.push(pageArr[i]); //插到队列尾
                }
            } else { //页框初始化后
                if((lruArr.indexOf(pageArr[i])) == -1) { //不重复时,删除队头页号，新的页号插入队列尾
                    lruArr.shift(); //删除队头页号
                    lruArr.push(pageArr[i]); //新来的页号插到队列尾
                    num3++; //缺页数加1
                } else { //重复时，与初始化时的有重复时的处理一样,将该重复的页号调到队列尾
                    lruArr.splice(lruArr.indexOf(pageArr[i]), 1); //删除
                    lruArr.push(pageArr[i]); //重新插到队列尾
                }
            }
        }

        /********opt算法*******/
            // var pageArr = [2,3,2,1,5,2,4,5,3,2,5,2]; //页地址流数组
        let num5; //当缺页时判断是否可以置换了的标志
        for(let i = 0; i < pageArr.length; i++) {
            if(optArr.length < k) { //页框初始化前
                if((optArr.indexOf(pageArr[i])) != -1) { //有重复，则跳出该循环
                    continue;
                } else { //无重复，则新页号直接插入到队列尾
                    optArr.push(pageArr[i]);
                }
            } else { //页框初始化后
                if((optArr.indexOf(pageArr[i])) != -1) { //有重复，则也是直接跳出该循环
                    continue;
                } else { //无重复，
                    num4++; //缺页数加1
                    num5 = 0;
                    //从i开始往后循环数组1,两种情况下跳出循环
                    for(let j = i + 1; (num5 < k - 1) && (j < pageArr.length); j++) { //注意这里的循环跳出条件，贼坑，看我下面注释掉的代码，应该是要取反的，因为是满足才进入，不满足跳出
                        if((optArr.indexOf(pageArr[j])) != -1) { //pageArr后面有跟pageArr数组重复时，num2++，并将该元素调到队列尾
                            num5++;
                            optArr.splice(optArr.indexOf(pageArr[j]), 1);
                            optArr.push(pageArr[j]);
                        } else {
                            continue;
                        }
                    }
                    //跳出循环后，删除队头元素，将新元素加到队列尾
                    optArr.shift();
                    optArr.push(pageArr[i]);
                }
            }
        }

        /***动态添加命中率数据到表格中***/
        num2 = 1 - (num2 / 400);
        num3 = 1 - (num3 / 400);
        num4 = 1 - (num4 / 400);
        num2 = num2.toFixed(4);
        num3 = num3.toFixed(4);
        num4 = num4.toFixed(4);
        var $txt2 = $(".content").html();
        $(".content").html(`${$txt2}
                       <tr>
                           <td>${k}</td>
                           <td>${num4}</td>
                           <td>${num2}</td>
                           <td>${num3}</td>
                       </tr>
            `);
    }
}

var $txt1 = $(".content").html(); //单击函数开始前保存刚开始的$(".content")节点的html代码
$(document).ready(function() {
    $(".btn").click(function () {
        random(); //生成随机数函数
        $(".addressTxt").attr("placeholder", addressArr); //地址流显示到屏幕上
        $(".pageNumTxt").attr("placeholder", pageArr); //页号流显示到屏幕上
        $(".a").attr("placeholder", pageArr);
        //每次点击时又重新赋值为刚开始时的html代码
        $(".content").html("$txt1"); //jq选择器跟html()方法是的html代码都得加"",被坑了好几次，而且好像也没有什么错误提醒？
        replace();
        $(".summary").html(`
                <h4>
                    总结： <br>
                    1，算法性能优越性：OPT > LRU > FIFO; <br>
                    2，在某一次实验中，可能 FIFO 比 LRU 性能更好，但足够多次的实验表明 LRU
                    的平均性能比 FIFO 更好; <br>
                    3，计算缺页率时，是以页框填满之前和之后的总缺页次数计算. <br>
                </h4>
        `);
    });
});